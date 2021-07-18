import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePartTextWidget from "@/ts/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

export default abstract class GuideHistoryEntryVso<D = GuideHistoryEntryReadDto | GuideHistoryEntryCreateDto> {
    public descriptor: GuideDescriptorVso;
    public parts: (GuidePartTextWidget | GuidePartVideoWidget)[];
    public isPublic: boolean;

    protected constructor(entry: GuideHistoryEntryDto) {
        this.descriptor = new GuideDescriptorVso(entry.descriptor)
        this.parts = entry.parts.map(
            part =>
                part.kind === 'text'
                    ? new GuidePartTextWidget(part)
                    : new GuidePartVideoWidget(part)
        );
        this.isPublic = entry.isPublic
    }

    get isEmpty(): boolean {
        return this.descriptor.isEmpty && this.parts.length === 0;
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

