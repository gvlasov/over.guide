import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

export default class NewGuideHistoryEntryVso extends GuideHistoryEntryVso<GuideHistoryEntryCreateDto> {

    constructor(entry: GuideHistoryEntryCreateDto) {
        super(entry)
    }

    toDto(): GuideHistoryEntryCreateDto {
        return {
            descriptor: {
                playerHeroes:
                    this.descriptor.players.heroes.map(hero => hero.id),
                teammateHeroes:
                    this.descriptor.teammates.heroes.map(hero => hero.id),
                enemyHeroes:
                    this.descriptor.enemies.heroes.map(hero => hero.id),
                playerAbilities:
                    this.descriptor.players.abilities.map(ability => ability.id),
                teammateAbilities:
                    this.descriptor.teammates.abilities.map(ability => ability.id),
                enemyAbilities:
                    this.descriptor.enemies.abilities.map(ability => ability.id),
                mapTags: this.descriptor.maps.map(vso => vso.id),
                thematicTags: this.descriptor.thematicTags.map(vso => vso.id),
            },
            parts: this.parts.map(widget => widget.part),
            isPublic: this.isPublic,
        } as GuideHistoryEntryCreateDto
    }
}

