import TeamComp from "./TeamComp";
import HeroDto from "data/dto/HeroDto"
import heroes from "data/heroes"
import PickContextDto from "data/dto/PickContextDto";
import MapId from "data/MapId";
import HeroId from "data/HeroId";

export default class PickContext {
    public readonly teammateComp: TeamComp;
    public readonly enemyComp: TeamComp | null;
    public readonly bans: HeroDto[];
    public readonly map: MapId | null;

    constructor(
        teammateComp: TeamComp,
        enemyComp: TeamComp | null,
        bans: HeroDto[],
        map: MapId | null
    ) {
        this.teammateComp = teammateComp;
        this.enemyComp = enemyComp;
        this.bans = bans;
        this.map = map;
    }

    heroesLeftForRoster(): HeroDto[] {
        const remainingRoles = this.teammateComp.remainingRoles();
        return Array.from(heroes.values()).filter(
            hero =>
                !this.teammateComp.heroes.find(
                    teammateHero => teammateHero !== null && teammateHero.dataName === hero.dataName
                )
                && remainingRoles.includes(hero.role)
        );
    };

    isAllPick(): boolean {
        return this.enemyComp !== null;
    };

    selectedOutHeroes(): HeroDto[] {
        if (this.enemyComp !== null && !this.enemyComp.isFull()) {
            return [
                ...this.enemyComp.picks(),
                ...this.enemyComp.heroesInPickedOutRoles()
            ];
        } else if (!this.teammateComp.isFull()) {
            return [
                ...this.teammateComp.picks(),
                ...this.teammateComp.heroesInPickedOutRoles()
            ];
        } else {
            return [...heroes.values()];
        }
    };

    forRequest(): PickContextDto {
        const teammateComp: HeroId[] =
            this.teammateComp.heroes
                .filter((h): h is HeroDto => h !== null)
                .map((hero: HeroDto): HeroId => hero.id);
        return {
            teammateComp: teammateComp,
            enemyComp:
                (
                    this.isAllPick()
                        ? [...(this.enemyComp as TeamComp).heroes]
                        : TeamComp.empty().heroes
                )
                    .filter((h): h is HeroDto => h !== null)
                    .map<HeroId>(hero => hero.id),
            bans: this.bans.map(hero => hero.id),
            map: this.map
        }
    };
}
