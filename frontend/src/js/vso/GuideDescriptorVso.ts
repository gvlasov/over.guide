import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import heroes from 'data/heroes'
import maps from 'data/maps'
import thematicTags from 'data/thematicTags'
import abilities from 'data/abilities'
import TagGroupVso from "@/js/vso/TagGroupVso";
import AbilityVso from "@/js/vso/AbilityVso";
import GamerPositionVso from "@/js/vso/GamerPositionVso";
import ThematicTagVso from "@/js/vso/ThematicTagVso";
import MapTagVso from "@/js/vso/MapTagVso";
import IndividualTagVso from "@/js/vso/IndividualTagVso";

export default class GuideDescriptorVso {

    public players: TagGroupVso;
    public allies: TagGroupVso;
    public enemies: TagGroupVso;
    public individualTags: IndividualTagVso[];
    private dto: GuideDescriptorDto;

    constructor(descriptor: GuideDescriptorDto) {
        this.dto = descriptor;
        const allHeroes = Array.from(heroes.values())
        const allMaps = Array.from(maps.values())
        const allThematicTags = Array.from(thematicTags.values())
        const allAbilities = Array.from(abilities.values())
        this.players = new TagGroupVso(
            allHeroes.filter(hero => descriptor.playerHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.playerAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
            GamerPositionVso.Players,
        );
        this.allies = new TagGroupVso(
            allHeroes.filter(hero => descriptor.allyHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.allyAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
            GamerPositionVso.Allies,
        );
        this.enemies = new TagGroupVso(
            allHeroes
                .filter(hero => descriptor.enemyHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.enemyAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
            GamerPositionVso.Enemies,
        );
        this.individualTags =
            allMaps.filter(map => descriptor.mapTags
                .includes(map.id))
                .map(map => new MapTagVso(map))
                .concat(
                    allThematicTags
                        .filter(tag => descriptor.thematicTags.includes(tag.id))
                        .map(tag => new ThematicTagVso(tag))
                );
    }

    getGroupByGamerPosition(gamerPosition: GamerPositionVso) : TagGroupVso {
        if (gamerPosition.isAlly) {
            return this.allies;
        } else if (gamerPosition.isEnemy) {
            return this.enemies;
        } else if (gamerPosition.isPlayer) {
            return this.players;
        } else {
            throw new Error('Unknown gamer position');
        }
    }

    clone(): GuideDescriptorVso {
        return new GuideDescriptorVso(this.dto);
    }

    get maps(): MapTagVso[] {
        return this.individualTags.filter(t => t instanceof MapTagVso);
    }

    get thematicTags(): ThematicTagVso[] {
        return this.individualTags.filter(t => t instanceof ThematicTagVso);
    }

    get isEmpty(): boolean {
        return this.players.heroes.length +
            this.allies.heroes.length +
            this.enemies.heroes.length +
            this.maps.length +
            this.individualTags.length === 0;
    }

    equals(another: GuideDescriptorVso | null): boolean {
        if (another === null) {
            return false;
        }
        return this.hash === another.hash;
    }

    get hash(): string {
        return [
            this.players.heroes.map(h => h.id),
            this.players.abilities.map(a => a.id),
            this.allies.heroes.map(h => h.id),
            this.allies.abilities.map(a => a.id),
            this.enemies.heroes.map(h => h.id),
            this.enemies.abilities.map(a => a.id),
            this.maps.map(m => m.id),
            this.thematicTags.map(t => t.id)
        ].toString()
    }

}
