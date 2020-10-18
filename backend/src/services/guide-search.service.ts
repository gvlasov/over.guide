import {Inject, Injectable} from '@nestjs/common';
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import {Op} from "sequelize";
import {GuideHead} from "src/database/models/GuideHead";
import AbilityId from "data/AbilityId";
import {IsDefined} from "class-validator";
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";

export class GuideSearchQuery implements GuideSearchQueryDto {

    playerHeroes: HeroId[] = []

    playerAbilities: AbilityId[] = []

    teammateHeroes: HeroId[] = []

    teammateAbilities: AbilityId[] = []

    enemyHeroes: HeroId[] = []

    enemyAbilities: AbilityId[] = []

    abilities: AbilityId[];

    mapTags: MapId[] = []

    thematicTags: GuideTheme[] = []

    user: number;

    @IsDefined({always: true})
    pageNumber: number

    @IsDefined({always: true})
    clientAlreadyHasGuideIds: number[];

    exact: boolean

}

@Injectable()
export class GuideSearchService {
    private static pageSize: number = 10

    constructor(
        @Inject(SEQUELIZE) private readonly  sequelize: Sequelize,
        private readonly guideDescriptorService: GuideDescriptorService
    ) {
    }

    async search(query: GuideSearchQuery): Promise<GuideSearchPageDto> {
        const nextGuides =
            await GuideHead.findAll(
                {
                    include: GuideHead.includesForDto({
                        guideHistoryEntry: {
                            where: {
                                descriptorId: await this.getDescriptorIds(query),
                            }
                        },
                        guide: {
                            where: {
                                isPublic: true,
                                deactivatedAt: null,
                                deactivatedById: null,
                            }
                        }
                    }),
                    where: {
                        guideId: {
                            [Op.notIn]: query.clientAlreadyHasGuideIds
                        },
                    },
                    limit: GuideSearchService.pageSize + 1,
                    order: [['guideHistoryEntryId', 'DESC']]
                });
        return {
            guides: nextGuides
                .slice(0, GuideSearchService.pageSize)
                .map(entry => entry.toDto()),
            pageNumber: query.pageNumber + 1,
            hasNextPage: nextGuides.length > GuideSearchService.pageSize,
        }
    }

    private async getDescriptorIds(query: GuideSearchQuery): Promise<number[]> {
        let descriptors;
        if (query.exact) {
            descriptors = await this.guideDescriptorService.getExact(query).then(
                descriptor => {
                    if (descriptor === null) {
                        return []
                    } else {
                        return [descriptor]
                    }
                }
            );
        } else {
            descriptors = await this.guideDescriptorService.getIncluding(query)
        }
        return descriptors
            .map(descriptor => descriptor.id);
    }

    async searchByAuthor(authorId: number, pageNumber: number): Promise<GuideSearchPageDto> {
        const nextGuides =
            await GuideHead.findAll({
                include: GuideHead.includesForDto({
                    author: {
                        where: {
                            id: authorId
                        }
                    }
                }),
                limit: GuideSearchService.pageSize + 1,
                order: [['guideId', 'DESC']]
            });
        return {
            guides: nextGuides
                .slice(0, GuideSearchService.pageSize)
                .map(head => head.toDto()),
            pageNumber: pageNumber + 1,
            hasNextPage: nextGuides.length > GuideSearchService.pageSize,
        } as GuideSearchPageDto
    }

}
