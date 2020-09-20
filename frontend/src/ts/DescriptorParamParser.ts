import heroes from 'data/heroes'
import maps from 'data/maps'
import thematicTags from 'data/thematicTags'
import abilities from 'data/abilities'
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import GamerPositionId from "data/GamerPositionId";
import uniq from "lodash.uniq"
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagGroupVso from "@/ts/vso/TagGroupVso";
import DescriptorParseError from "@/ts/DescriptorParseError";

type DtoType = 'heroes' | 'maps' | 'thematicTags' | 'abilities';

class DtoMap {

    private readonly vsos: any;

    constructor() {
        this.vsos = {};
        for (let hero of Array.from(heroes.values())) {
            this.setDto(hero, 'heroes')
        }
        for (let ability of Array.from(abilities.values())) {
            this.setDto(ability, 'abilities')
        }
        for (let map of Array.from(maps.values())) {
            this.setDto(map, 'maps')
        }
        for (let thematicTag of Array.from(thematicTags.values())) {
            this.setDto(thematicTag, 'thematicTags')
        }
    }

    private setDto(dto: any, type: DtoType) {
        if (dto.hasOwnProperty(dto.dataName)) {
            throw new Error(
                `Vso with dataName = ${dto.dataName} is already registered:\n${JSON.stringify(this.vsos[dto.dataName])}`
            )
        }
        this.vsos[dto.dataName] = [type, dto];
    }

    getByDataName(dataName: string): [DtoType, any] {
        const vso = this.vsos[dataName];
        if (typeof vso === 'undefined') {
            throw new DescriptorParseError('No object with dataName = ' + dataName)
        }
        return vso
    }

    getGuideDescriptorDtoFieldName(type: DtoType, gamerPosition: GamerPositionId | null): keyof GuideDescriptorDto {
        if (type === 'heroes') {
            if (gamerPosition === GamerPositionId.Players) {
                return 'playerHeroes'
            } else if (gamerPosition === GamerPositionId.Teammates) {
                return 'teammateHeroes'
            } else if (gamerPosition === GamerPositionId.Enemies) {
                return 'enemyHeroes'
            }
        } else if (type === 'abilities') {
            if (gamerPosition === GamerPositionId.Players) {
                return 'playerAbilities'
            } else if (gamerPosition === GamerPositionId.Teammates) {
                return 'teammateAbilities'
            } else if (gamerPosition === GamerPositionId.Enemies) {
                return 'enemyAbilities'
            }
        } else if (type === 'maps') {
            return 'mapTags'
        } else if (type === 'thematicTags') {
            return 'thematicTags'
        }
        throw new DescriptorParseError(
            `Unidentified specifier: ${type} ${gamerPosition}`
        )
    }
}

export default class DescriptorParamParser {
    private readonly vsoMap: DtoMap;

    constructor() {
        this.vsoMap = new DtoMap()
    }

    unparseDescriptor(vso: GuideDescriptorVso) {
        return [
            DescriptorParamParser.unparseTagGroup(vso.players),
            DescriptorParamParser.unparseTagGroup(vso.teammates),
            DescriptorParamParser.unparseTagGroup(vso.enemies),
            vso.thematicTags.map(tag => tag.dataName).join(','),
            vso.maps.map(m => m.dataName).join(','),
        ]
            .join(';')
            ;
    }

    private static unparseTagGroup(tagGroup: TagGroupVso): string {
        return tagGroup.gamerPosition.plural.toLowerCase() + ':' +
            tagGroup.heroes.map(h => h.dataName).concat(
                tagGroup.abilities.map(a => a.dataName)
            )
                .join(',');
    }

    parseParam(descriptorParam: string): GuideDescriptorDto {
        const output = {
            playerHeroes: [],
            playerAbilities: [],
            teammateHeroes: [],
            teammateAbilities: [],
            enemyHeroes: [],
            enemyAbilities: [],
            thematicTags: [],
            mapTags: [],
        } as GuideDescriptorDto;
        for (let positionPart of descriptorParam.split(';')) {
            let itemsTexts, positionPartName: string | null;
            const split = positionPart.split(':');
            positionPartName = split[0]
            itemsTexts = split[1].split(',')
            const dtoTypeWithDtos = uniq(itemsTexts)
                .map(
                    (dataName: string) => this.vsoMap.getByDataName(dataName)
                )
            for (let [dtoType, dto] of dtoTypeWithDtos) {
                const field = this.vsoMap.getGuideDescriptorDtoFieldName(
                    dtoType,
                    (positionPartName === 'maps'
                        || positionPartName === 'tags')
                        ? null
                        : DescriptorParamParser.positionPartName2PositionId(positionPartName)
                );
                (output[field] as any[]).push(dto.id)
            }
        }
        return output
    }

    private static positionPartName2PositionId(positionPart: string): GamerPositionId {
        if (positionPart === 'players') {
            return GamerPositionId.Players
        } else if (positionPart === 'teammates') {
            return GamerPositionId.Teammates
        } else if (positionPart === 'enemies') {
            return GamerPositionId.Enemies
        } else {
            throw new DescriptorParseError(
                'Incorrect position part name ' + positionPart
            )
        }
    }
}
