import {Inject, Injectable} from '@nestjs/common';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto"
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import {QueryTypes} from "sequelize";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {ContentHashService} from "src/services/content-hash.service";


@Injectable()
export class GuideDescriptorService {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly contentHashService: ContentHashService
    ) {
    }

    /**
     * Returns a descriptor from DB that exactly matches the DTO,
     * or creates one if none match.
     * @param dto
     */
    async getExact(dto: GuideDescriptorDto): Promise<GuideDescriptor | null> {
        return this.buildQuery(dto, true)
            .then(descriptors => {
                if (descriptors.length > 1) {
                    throw new Error(
                        'Multiple descriptors found for DTO:\n' + JSON.stringify(dto)
                    )
                } else if (descriptors.length === 0) {
                    return null
                } else {
                    return descriptors[0]
                }
            })
    }

    async getIncluding(dto: GuideDescriptorDto): Promise<GuideDescriptor[]> {
        return this.buildQuery(dto, false)
    }

    private buildQuery(dto: GuideDescriptorDto, exact: boolean) {
        const parts = [
            ['mapTags', 'Map', 'mapId'],
            ['thematicTags', 'ThematicTag', 'thematicTagId'],
            ['playerHeroes', 'PlayerHero', 'heroId'],
            ['allyHeroes', 'AllyHero', 'heroId'],
            ['enemyHeroes', 'EnemyHero', 'heroId'],
        ].map(
            item => {
                const [partName, tableSuffix, pivotTableFieldName] = item
                return GuideDescriptorService.buildQueryPart(
                    dto,
                    partName,
                    tableSuffix,
                    pivotTableFieldName,
                    exact
                )
            }
        )
            .filter(part => part !== null);
        return this.sequelize.query<GuideDescriptor>(
            (parts.length === 0) ?
                    `select *
                     from GuideDescriptor`
                :
                `
                    select *
                    from GuideDescriptor
                    where id in (
                        (
                        ${parts.join(`) ${exact ? 'intersect' : 'union all'} (`)}
                    )
                )
            `,
            {
                type: QueryTypes.SELECT,
                model: GuideDescriptor,
                replacements: {
                    mapTags: dto.mapTags,
                    thematicTags: dto.thematicTags,
                    playerHeroes: dto.playerHeroes,
                    allyHeroes: dto.allyHeroes,
                    enemyHeroes: dto.enemyHeroes,
                }
            }
        )
    }

    obtainExact(guideDescriptorDto: GuideDescriptorDto): Promise<GuideDescriptor> {
        if (
            [
                ...guideDescriptorDto.thematicTags,
                ...guideDescriptorDto.mapTags,
                ...guideDescriptorDto.playerHeroes,
                ...guideDescriptorDto.allyHeroes,
                ...guideDescriptorDto.enemyHeroes,
            ]
                .length === 0
        ) {
            throw new Error(`Can't obtain descriptor from empty DTO`)
        }
        return this.getExact(guideDescriptorDto)
            .then(async oldDescriptor => {
                let result;
                if (oldDescriptor === null) {
                    const newDescriptor = await GuideDescriptor.create({
                        contentHash: this.contentHashService.hash(guideDescriptorDto)
                    })
                    guideDescriptorDto.playerHeroes.forEach(
                        heroId => {
                            GuideDescriptor2PlayerHero.create(
                                {
                                    guideDescriptorId: newDescriptor.id,
                                    heroId: heroId,
                                }
                            )
                        }
                    )
                    guideDescriptorDto.allyHeroes.forEach(
                        heroId => {
                            GuideDescriptor2AllyHero.create(
                                {
                                    guideDescriptorId: newDescriptor.id,
                                    heroId: heroId,
                                }
                            )
                        }
                    )
                    guideDescriptorDto.enemyHeroes.forEach(
                        heroId => {
                            GuideDescriptor2EnemyHero.create(
                                {
                                    guideDescriptorId: newDescriptor.id,
                                    heroId: heroId,
                                }
                            )
                        }
                    )
                    guideDescriptorDto.thematicTags.forEach(
                        tagId => {
                            GuideDescriptor2ThematicTag.create(
                                {
                                    guideDescriptorId: newDescriptor.id,
                                    thematicTagId: tagId,
                                }
                            )
                        }
                    )
                    guideDescriptorDto.mapTags.forEach(
                        mapId => {
                            GuideDescriptor2Map.create(
                                {
                                    guideDescriptorId: newDescriptor.id,
                                    mapId: mapId,
                                }
                            )
                        }
                    )
                    result = newDescriptor
                } else {
                    result = oldDescriptor
                }
                return result
            })
    }

    private static buildQueryPart(
        guideDescriptorDto: GuideDescriptorDto,
        partName: string,
        tableSuffix: string,
        pivotTableFieldName: string,
        exact: boolean
    ): string | null {
        const pivotTableName = `GuideDescriptor2${tableSuffix}`
        const items = guideDescriptorDto[partName]
        if (items.length === 0) {
            if (exact) {
                return `
            select GuideDescriptor.id as guideDescriptorId
            from GuideDescriptor
            left join ${pivotTableName}
            on ${pivotTableName}.guideDescriptorId = GuideDescriptor.id
where ${pivotTableName}.${pivotTableFieldName} is null
            `
            } else {
                return null
            }
        } else {
            if (exact) {
                return `
select distinct guideDescriptorId from (
                select guideDescriptorId
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as count
                from ${pivotTableName}
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where count = ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
) tbl_${partName}
            `
            } else {
                return `
select distinct guideDescriptorId from (
                select guideDescriptorId
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as count
                from ${pivotTableName}
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where count >= ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
) tbl_${partName}
            `
            }
        }
    }

}
