import {Injectable} from '@nestjs/common';
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {Guide} from "src/database/models/Guide";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import {Op} from "sequelize";
import {GuideHead} from "src/database/models/GuideHead";
import AbilityId from "data/AbilityId";
import {User} from "src/database/models/User";
import {IsDefined} from "class-validator";

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

}

@Injectable()
export class GuideSearchService {
    private static pageSize: number = 10

    constructor(
        private readonly guideDescriptorService: GuideDescriptorService
    ) {
    }

    async search(query: GuideSearchQuery): Promise<GuideSearchPageDto> {
        const nextGuides =
            await GuideHistoryEntry.findAll({
                include: [
                    {
                        model: Guide,
                        as: 'guide',
                        where: {
                            deactivatedById: null,
                            deactivatedAt: null,
                        },
                        include: [{model: User, as: 'creator'}]
                    },
                    {
                        model: GuidePartText, as: 'guidePartTexts',
                        include: [{all: true}],
                    },
                    {
                        model: GuidePartVideo, as: 'guidePartVideos',
                        include: [{all: true}],
                    },
                    {
                        model: GuideDescriptor,
                        as: 'descriptor',
                        include: [{all: true}],
                    },
                    {
                        model: GuideHead,
                        as: 'headRecord',
                        required: true,
                    }
                ],
                where: {
                    guideId: {
                        [Op.notIn]: query.clientAlreadyHasGuideIds
                    },
                    descriptorId:
                        (await this.guideDescriptorService
                            .getIncluding(query))
                            .map(descriptor => descriptor.id),
                },
                limit: GuideSearchService.pageSize + 1,
                order: [['id', 'DESC']]
            });
        return {
            guides: nextGuides
                .slice(0, GuideSearchService.pageSize)
                .map(entry => entry.toDto()),
            pageNumber: query.pageNumber + 1,
            hasNextPage: nextGuides.length > GuideSearchService.pageSize,
        }
    }

    async searchByCreator(creatorId: number, pageNumber: number): Promise<GuideSearchPageDto> {
        const nextGuides =
            await GuideHistoryEntry.findAll({
                include: [
                    {
                        model: Guide,
                        as: 'guide',
                        where: {
                            deactivatedById: null,
                            deactivatedAt: null,
                        },
                        include: [{
                            model: User,
                            as: 'creator',
                            where: {
                                id: creatorId,
                            }
                        }]
                    },
                    {
                        model: GuidePartText, as: 'guidePartTexts',
                        include: [{all: true}],
                    },
                    {
                        model: GuidePartVideo, as: 'guidePartVideos',
                        include: [{all: true}],
                    },
                    {
                        model: GuideDescriptor,
                        as: 'descriptor',
                        include: [{all: true}],
                    },
                    {
                        model: GuideHead,
                        as: 'headRecord',
                        required: true,
                    }
                ],
                limit: GuideSearchService.pageSize + 1,
                order: [['id', 'DESC']]
            });
        return {
            guides: nextGuides
                .slice(0, GuideSearchService.pageSize)
                .map(entry => entry.toDto()),
            pageNumber: pageNumber + 1,
            hasNextPage: nextGuides.length > GuideSearchService.pageSize,
        }
    }

}
