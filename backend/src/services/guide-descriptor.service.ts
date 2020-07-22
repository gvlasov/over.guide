import {Inject, Injectable} from '@nestjs/common';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import GuideDescriptorDto from "data/dto/GuideDescriptor"
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import {QueryTypes} from "sequelize";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";


@Injectable()
export class GuideDescriptorService {

    constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {
    }

    /**
     * Returns a descriptor from DB that exactly matches the DTO,
     * or creates one if none match.
     * @param guideDescriptorDto
     */
    async getExact(guideDescriptorDto: GuideDescriptorDto): Promise<GuideDescriptor | null> {
        return this.sequelize.query<GuideDescriptor>(
            `
                    select *
                    from GuideDescriptor
                    where id in (
                        (
                        ${
                [
                    ['mapTags', 'Map', 'mapId'],
                    ['thematicTags', 'ThematicTag', 'thematicTagId'],
                    ['playerHeroes', 'PlayerHero', 'heroId'],
                    ['allyHeroes', 'AllyHero', 'heroId'],
                    ['enemyHeroes', 'EnemyHero', 'heroId'],
                ].map(
                    item => {
                        const [partName, tableSuffix, pivotTableFieldName] = item
                        return GuideDescriptorService.buildQueryPart(
                            guideDescriptorDto,
                            partName,
                            tableSuffix,
                            pivotTableFieldName
                        )
                    }
                )
                    .join(') intersect (')
            }
                    )
                )
            `,
            {
                type: QueryTypes.SELECT,
                model: GuideDescriptor,
                replacements: {
                    mapTags: guideDescriptorDto.mapTags,
                    thematicTags: guideDescriptorDto.thematicTags,
                    playerHeroes: guideDescriptorDto.playerHeroes,
                    allyHeroes: guideDescriptorDto.allyHeroes,
                    enemyHeroes: guideDescriptorDto.enemyHeroes,
                }
            }
        )
            .then(descriptors => {
                if (descriptors.length > 1) {
                    throw new Error(
                        'Multiple descriptors found for DTO:\n' + JSON.stringify(guideDescriptorDto)
                    )
                } else if (descriptors.length === 0) {
                    return null
                } else {
                    return descriptors[0]
                }
            })
    }

    obtainExact(guideDescriptorDto: GuideDescriptorDto): Promise<GuideDescriptor> {
        return this.getExact(guideDescriptorDto)
            .then(async oldDescriptor => {
                let result;
                if (oldDescriptor === null) {
                    const newDescriptor = await GuideDescriptor.create()
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
        pivotTableFieldName: string
    ): string {
        const pivotTableName = `GuideDescriptor2${tableSuffix}`
        const items = guideDescriptorDto[partName]
        if (items.length === 0) {
            return `
            select GuideDescriptor.id as guideDescriptorId
            from GuideDescriptor
            left join ${pivotTableName}
            on ${pivotTableName}.guideDescriptorId = GuideDescriptor.id
where ${pivotTableName}.${pivotTableFieldName} is null
            `
        } else {
            return `
select distinct guideDescriptorId from (
                select guideDescriptorId,
                       ${pivotTableFieldName}
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as count
                from ${pivotTableName}
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where count = ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
) tbl_${partName}
            `
        }
    }

}
