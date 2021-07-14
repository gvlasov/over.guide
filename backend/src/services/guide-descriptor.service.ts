import {Inject, Injectable} from '@nestjs/common';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import GuideDescriptorDto, {MAX_DESCRIPTOR_TOTAL_ABILITY_COUNT} from "data/dto/GuideDescriptorDto"
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import {QueryTypes} from "sequelize";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2TeammateHero} from "src/database/models/GuideDescriptor2TeammateHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptor2PlayerAbility} from "src/database/models/GuideDescriptor2PlayerAbility";
import {GuideDescriptor2TeammateAbility} from "src/database/models/GuideDescriptor2TeammateAbility";
import {GuideDescriptor2EnemyAbility} from "src/database/models/GuideDescriptor2EnemyAbility";
import EmptyDescriptorException from "src/services/EmptyDescriptorException";
import ImpossibleDescriptorError from "src/services/ImpossibleDescriptorError";
import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import dataAbilities from "data/abilities"
import difference from "lodash.difference"
import uniq from "lodash.uniq"


@Injectable()
export class GuideDescriptorService {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly contentHashService: ContentHashService
    ) {
    }

    isEmpty(dto: GuideDescriptorDto) : boolean {
        return (dto.thematicTags.length +
            dto.mapTags.length +
            dto.playerHeroes.length +
            dto.playerAbilities.length +
            dto.teammateHeroes.length +
            dto.teammateAbilities.length +
            dto.enemyHeroes.length +
            dto.enemyAbilities.length === 0);
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
            ['playerAbilities', 'PlayerAbility', 'abilityId'],
            ['teammateHeroes', 'TeammateHero', 'heroId'],
            ['teammateAbilities', 'TeammateAbility', 'abilityId'],
            ['enemyHeroes', 'EnemyHero', 'heroId'],
            ['enemyAbilities', 'EnemyAbility', 'abilityId'],
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
                    where 
                        ${
                parts
                    .map(part => `id in (${part})`)
                    .join(` and `)
            }
            `,
            {
                type: QueryTypes.SELECT,
                model: GuideDescriptor,
                replacements: {
                    mapTags: dto.mapTags,
                    thematicTags: dto.thematicTags,
                    playerHeroes: dto.playerHeroes,
                    playerAbilities: dto.playerAbilities,
                    teammateHeroes: dto.teammateHeroes,
                    teammateAbilities: dto.teammateAbilities,
                    enemyHeroes: dto.enemyHeroes,
                    enemyAbilities: dto.enemyAbilities,
                }
            }
        )
    }

    obtainExact(guideDescriptorDto: GuideDescriptorDto): Promise<GuideDescriptor> {
        if (
            this.isEmpty(guideDescriptorDto)
        ) {
            throw new EmptyDescriptorException(
                `Can't obtain descriptor from empty DTO`
            )
        }
        GuideDescriptorService.validateAbilitiesCorrespondToHeroes(
            guideDescriptorDto.playerHeroes,
            guideDescriptorDto.playerAbilities
        )
        GuideDescriptorService.validateAbilitiesCorrespondToHeroes(
            guideDescriptorDto.teammateHeroes,
            guideDescriptorDto.teammateAbilities
        )
        GuideDescriptorService.validateAbilitiesCorrespondToHeroes(
            guideDescriptorDto.enemyHeroes,
            guideDescriptorDto.enemyAbilities
        )
        GuideDescriptorService.validateAbilitiesNumber(
            guideDescriptorDto,
        )
        return this.getExact(guideDescriptorDto)
            .then(async oldDescriptor => {
                let result;
                if (oldDescriptor === null) {
                    const newDescriptor = await GuideDescriptor.create({
                        contentHash: this.contentHashService.hash(guideDescriptorDto)
                    })
                    for (const heroId of guideDescriptorDto.playerHeroes) {
                        await GuideDescriptor2PlayerHero.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                heroId: heroId,
                            }
                        )
                    }
                    for (const abilityId of guideDescriptorDto.playerAbilities) {
                        await GuideDescriptor2PlayerAbility.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                abilityId: abilityId,
                            }
                        )
                    }
                    for (const heroId of guideDescriptorDto.teammateHeroes) {
                        await GuideDescriptor2TeammateHero.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                heroId: heroId,
                            }
                        )
                    }
                    for (const abilityId of guideDescriptorDto.teammateAbilities) {
                        await GuideDescriptor2TeammateAbility.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                abilityId: abilityId,
                            }
                        )
                    }
                    for (const heroId of guideDescriptorDto.enemyHeroes) {
                        await GuideDescriptor2EnemyHero.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                heroId: heroId,
                            }
                        )
                    }
                    for (const abilityId of guideDescriptorDto.enemyAbilities) {
                        await GuideDescriptor2EnemyAbility.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                abilityId: abilityId,
                            }
                        )
                    }
                    for (const tagId of guideDescriptorDto.thematicTags) {
                        await GuideDescriptor2ThematicTag.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                thematicTagId: tagId,
                            }
                        )
                    }
                    for (const mapId of guideDescriptorDto.mapTags) {
                        await GuideDescriptor2Map.create(
                            {
                                guideDescriptorId: newDescriptor.id,
                                mapId: mapId,
                            }
                        )
                    }
                    result = newDescriptor
                } else {
                    result = oldDescriptor
                }
                return result
            })
    }

    private static validateAbilitiesCorrespondToHeroes(
        heroes: HeroId[],
        abilities: AbilityId[],
    ) {
        if (
            difference(
                uniq(
                    abilities
                        .map(a => dataAbilities.get(a).heroId)
                ),
                heroes
            )
                .length > 0
        ) {
            throw new ImpossibleDescriptorError()
        }
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
select guideDescriptorId
       from (
                select guideDescriptorId, tagCount, count(*) as matchCount
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as tagCount
                from ${pivotTableName}
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where tagCount = ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
           group by guideDescriptorId
) tbl_${partName}_intermediate_1
where tagCount = matchCount
           group by guideDescriptorId
            `
            } else {
                return `
select distinct guideDescriptorId from (
                select guideDescriptorId
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as count
                from ${pivotTableName}
                           where ${pivotTableFieldName} in (:${partName})
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where count >= ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
) tbl_${partName}
            `
            }
        }
    }

    private static validateAbilitiesNumber(dto: GuideDescriptorDto) {
        return dto.enemyAbilities.length + dto.playerAbilities.length + dto.teammateAbilities.length <= MAX_DESCRIPTOR_TOTAL_ABILITY_COUNT;
    }
}
