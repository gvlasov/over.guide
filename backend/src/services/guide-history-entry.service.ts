import {Inject, Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";
import {ContentHashService} from "src/services/content-hash.service";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import RestrictionTypeId from "data/RestrictionTypeId";
import {RestrictionService} from "src/services/restriction.service";

export enum SaveResult {
    SavingDuplicateRejected,
    UserBannedFromGuideCreation
}

@Injectable()
export class GuideHistoryEntryService {

    constructor(
        private readonly guideDescriptorService: GuideDescriptorService,
        private readonly contentHashService: ContentHashService,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly restrictionService: RestrictionService,
    ) {
    }

    async create(
        gheDto: GuideHistoryEntryCreateDto,
        saver: User
    ) {
        return this.save(
            gheDto,
            () => Guide.create({
                authorId: saver.id,
                isPublic: gheDto.isPublic
            }),
            saver
        )
    }

    async append(
        gheDto: GuideHistoryEntryAppendDto,
        saver: User
    ) {
        return this.save(
            gheDto,
            () => Guide.findOne({where: {id: gheDto.guideId}})
                .then(guide => {
                    if (!!guide.isPublic !== gheDto.isPublic) {
                        return guide.update({isPublic: !!gheDto.isPublic === true ? 1 : 0})
                    } else {
                        return guide
                    }
                }),
            saver
        )
    }

    private async save(
        gheDto: GuideHistoryEntryDto,
        obtainModel: () => Promise<Guide>,
        saver: User
    ): Promise<GuideHistoryEntry | SaveResult> {
        return this.sequelize.transaction(async (t) => {
            if (await this.restrictionService.hasActiveRestriction(saver, RestrictionTypeId.GuideCreationBan)) {
                return SaveResult.UserBannedFromGuideCreation
            }
            const descriptor = await
                this.guideDescriptorService.obtainExact(gheDto.descriptor);
            const guide = await obtainModel()
            const oldEntry = await GuideHistoryEntry.findOne({
                include: [{all: true}],
                where: {
                    guideId: guide.id
                },
                order: [['id', 'DESC']], // https://github.com/RobinBuschmann/sequelize-typescript/issues/82
            })
            const contentHash = this.contentHashService.hash(gheDto, (dto) => {
                delete dto.guideId
            });
            if (oldEntry !== null && oldEntry.contentHash === contentHash) {
                return SaveResult.SavingDuplicateRejected
            }
            const newEntry =
                await GuideHistoryEntry.create({
                    descriptorId: descriptor.id,
                    guideId: guide.id,
                    updaterId: saver.id,
                    contentHash: contentHash,
                })
            await Promise.all(
                gheDto.parts.map(
                    async (partDto) => {
                        if (partDto.kind === 'text') {
                            return GuideHistoryEntryService.obtainGuidePartText(
                                partDto as GuidePartTextDto
                            )
                        } else if (partDto.kind === 'video') {
                            return GuideHistoryEntryService.obtainGuidePartVideo(
                                partDto as GuidePartVideoDto
                            )
                        }
                    }
                )
                    .map((partPromise, index) => {
                        return partPromise.then((part: GuidePartText | GuidePartVideo): Promise<GuideHistoryEntry2GuidePartText | GuideHistoryEntry2GuidePartVideo> => {
                            if (part instanceof GuidePartText) {
                                return GuideHistoryEntry2GuidePartText.create({
                                    guideHistoryEntryId: newEntry.id,
                                    guidePartTextId: part.id,
                                    order: index
                                })
                            } else if (part instanceof GuidePartVideo) {
                                return GuideHistoryEntry2GuidePartVideo.create({
                                    guideHistoryEntryId: newEntry.id,
                                    guidePartVideoId: part.id,
                                    order: index
                                })
                            } else {
                                throw new Error(
                                    `${JSON.stringify(part)} is not supported as a guide part`
                                )
                            }
                        })

                    })
            )
            return newEntry
        })
    }

    private static async obtainGuidePartText(
        partDto: GuidePartTextDto
    ): Promise<GuidePartText> {
        return GuidePartText.findOne({
            where: {
                contentMd: partDto.contentMd,
            }
        })
            .then(part => {
                if (part !== null) {
                    return part
                } else {
                    return GuidePartText.create(partDto)
                }
            })
    }

    private static async obtainGuidePartVideo(
        partDto: GuidePartVideoDto
    ): Promise<GuidePartVideo> {
        return YoutubeVideoExcerpt.findOne({
            where: {
                youtubeVideoId: partDto.excerpt.youtubeVideoId,
                startSeconds: partDto.excerpt.startSeconds,
                endSeconds: partDto.excerpt.endSeconds,
            }
        })
            .then(excerpt => {
                if (excerpt === null) {
                    return YoutubeVideoExcerpt.create(partDto.excerpt)
                        .then(
                            (excerpt) =>
                                GuidePartVideo.create({
                                    excerptId: excerpt.id
                                })
                        )
                } else {
                    return GuidePartVideo.findOne({
                        where: {
                            excerptId: excerpt.id,
                        }
                    })
                        .then(part => {
                            if (part === null) {
                                return GuidePartVideo.create({
                                    excerptId: excerpt.id,
                                })
                            } else {
                                return part
                            }
                        })
                }
            })
    }

}
