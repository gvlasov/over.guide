import TeamComp from "./TeamComp";
import HeroDto from "data/dto/HeroDto"
import heroes from "data/heroes"
import PickContextDto from "data/dto/PickContextDto";

export default class PickContext {
    private readonly allyComp: TeamComp;
    private readonly enemyComp: TeamComp | null;
    private readonly bans: HeroDto[];
    private readonly map: string | null;

    constructor(
        allyComp: TeamComp,
        enemyComp: TeamComp | null,
        bans: HeroDto[],
        map: string | null
    ) {
        this.allyComp = allyComp;
        this.enemyComp = enemyComp;
        this.bans = bans;
        this.map = map;
    }

    heroesLeftForRoster(): HeroDto[] {
        const remainingRoles = this.allyComp.remainingRoles();
        return Array.from(heroes.values()).filter(
            hero =>
                !this.allyComp.heroes.find(
                    allyHero => allyHero !== null && allyHero.dataName === hero.dataName
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
        } else if (!this.allyComp.isFull()) {
            return [
                ...this.allyComp.picks(),
                ...this.allyComp.heroesInPickedOutRoles()
            ];
        } else {
            return [...heroes.values()];
        }
    };

    forRequest(): PickContextDto {
        const allyComp: string[] =
            this.allyComp.heroes
                .filter((h): h is HeroDto => h !== null)
                .map((hero: HeroDto): string => hero.dataName);
        return {
            allyComp: allyComp,
            enemyComp:
                (
                    this.isAllPick()
                        ? [...(this.enemyComp as TeamComp).heroes]
                        : TeamComp.empty().heroes
                )
                    .filter((h): h is HeroDto => h !== null)
                    .map<string>(hero => hero.dataName),
            bans: this.bans.map(hero => hero.dataName),
            map: this.map
        }
    };
}
