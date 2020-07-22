import {Inject, Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntry";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import GuidePartName from "data/dto/GuidePartName";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import GuidePartTextDto from "data/dto/GuidePartText";
import GuidePartVideoDto from "data/dto/GuidePartVideo";
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";

export enum SaveResult {
    SavingDuplicateRejected
}

@Injectable()
export class GuideHistoryEntryService {

    private crypto = require('crypto')

    constructor(
        private readonly guideDescriptorService: GuideDescriptorService,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize
    ) {
    }

    async save(gheDto: GuideHistoryEntryDto, saver: User): Promise<GuideHistoryEntry | SaveResult> {
        return this.sequelize.transaction(async (t) => {
            const guide =
                await (
                    typeof gheDto.guideId === 'undefined'
                        ? Guide.create({
                            creatorId: saver.id
                        })
                        : Guide.findOne({
                            where: {id: gheDto.guideId},
                        })
                )
            const descriptor = await
                this.guideDescriptorService.obtainExact(gheDto.descriptor);
            const oldEntry = await GuideHistoryEntry.findOne({
                where: {
                    guideId: guide.id
                },
                order: [['id', 'DESC']], // https://github.com/RobinBuschmann/sequelize-typescript/issues/82
            })
            const contentHash = this.getContentHash(gheDto);
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
                        if (partDto.kind === GuidePartName.Text) {
                            return GuideHistoryEntryService.obtainGuidePartText(
                                oldEntry,
                                partDto as GuidePartTextDto
                            )
                        } else if (partDto.kind === GuidePartName.Video) {
                            return GuideHistoryEntryService.obtainGuidePartVideo(
                                oldEntry,
                                partDto as GuidePartVideoDto
                            )
                        }
                    }
                )
                    .map((partPromise, index) => {
                        return partPromise.then((part: GuidePartText | GuidePartVideo) => {
                            if (part instanceof GuidePartText) {
                                GuideHistoryEntry2GuidePartText.create({
                                    guideHistoryEntryId: newEntry.id,
                                    guidePartTextId: part.id,
                                    order: index
                                })
                            } else if (part instanceof GuidePartVideo) {
                                GuideHistoryEntry2GuidePartVideo.create({
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

    private getContentHash(gheDto: GuideHistoryEntryDto): string {
        const contentOnly = Object.assign({}, gheDto);
        delete contentOnly.guideId
        return this.crypto.createHash('sha1').update(JSON.stringify(contentOnly)).digest('base64');
    }

    private static async obtainGuidePartText(
        entry: GuideHistoryEntry | null,
        partDto: GuidePartTextDto
    ): Promise<GuidePartText> {
        if (entry !== null) {
            for (let part of await entry.$get('guidePartTexts')) {
                if (part.contentMd === partDto.contentMd) {
                    return Promise.resolve(part)
                }
            }
        }
        return GuidePartText.create(partDto)
    }

    private static async obtainGuidePartVideo(
        entry: GuideHistoryEntry | null,
        partDto: GuidePartVideoDto
    ): Promise<GuidePartVideo> {
        if (entry !== null) {
            for (let part of await entry.$get('guidePartVideos')) {
                const excerpt = await part.$get('excerpt');
                if (
                    excerpt.youtubeVideoId === partDto.excerpt.youtubeVideoId
                    && excerpt.startSeconds === partDto.excerpt.startSeconds
                    && excerpt.endSeconds === partDto.excerpt.endSeconds
                ) {
                    return Promise.resolve(part)
                }
            }
        }
        const excerpt = await YoutubeVideoExcerpt.create(partDto.excerpt)
        return GuidePartVideo.create({
            excerptId: excerpt.id
        })
    }

}
