import {Injectable} from '@nestjs/common';
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {Guide} from "src/database/models/Guide";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import {Transform, Type} from "class-transformer";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import {Op} from "sequelize";
import {GuideHead} from "src/database/models/GuideHead";
import AbilityId from "data/AbilityId";
import {User} from "src/database/models/User";
import UserDto from "data/dto/UserDto";

export class GuideSearchQuery implements GuideSearchQueryDto {

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    playerHeroes: HeroId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    playerAbilities: AbilityId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    allyHeroes: HeroId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    allyAbilities: AbilityId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    enemyHeroes: HeroId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    enemyAbilities: AbilityId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    abilities: AbilityId[];

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    mapTags: MapId[] = []

    @Type(() => String)
    @Transform((value: string) => value.split(',').map(it => Number.parseInt(it)))
    thematicTags: GuideTheme[] = []

    @Type(() => String)
    @Transform((value: string) => Number.parseInt(value))
    pageNumber: number

    @Type(() => String)
    @Transform((value: string) => atob(value).split(',').map(it => Number.parseInt(it)))
    clientAlreadyHasGuideIds: number[] = []

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
                    {model: GuidePartText, as: 'guidePartTexts'},
                    {
                        model: GuidePartVideo, as: 'guidePartVideos',
                        include: [{all: true}]
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
                .map(entry => {
                    return {
                        author: {
                            id: entry.guide.creator.id,
                            name: entry.guide.creator.name,
                        } as UserDto,
                        createdAt: entry.guide.createdAt,
                        descriptor: entry.descriptor.toDto(),
                        guideId: entry.guideId,
                        parts: entry.partsOrdered.map(part => part.toDto()),
                    } as GuideHistoryEntryDto
                }),
            pageNumber: query.pageNumber + 1,
            hasNextPage: nextGuides.length > GuideSearchService.pageSize,
        }
    }

}
