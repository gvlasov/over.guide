import TeamComp from "./TeamComp";
import Hero from "data/dto/Hero"
import heroes from "data/heroes"
import PickContextDto from "data/dto/PickContext";

export default class PickContext {
    private readonly allyComp: TeamComp;
    private readonly enemyComp: TeamComp | null;
    private readonly bans: Hero[];
    private readonly map: string | null;

    constructor(
        allyComp: TeamComp,
        enemyComp: TeamComp | null,
        bans: Hero[],
        map: string | null
    ) {
        this.allyComp = allyComp;
        this.enemyComp = enemyComp;
        this.bans = bans;
        this.map = map;
    }

    heroesLeftForRoster(): Hero[] {
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

    selectedOutHeroes(): Hero[] {
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
                .filter((h): h is Hero => h !== null)
                .map((hero: Hero): string => hero.dataName);
        return {
            allyComp: allyComp,
            enemyComp:
                (
                    this.isAllPick()
                        ? [...(this.enemyComp as TeamComp).heroes]
                        : TeamComp.empty().heroes
                )
                    .filter((h): h is Hero => h !== null)
                    .map<string>(hero => hero.dataName),
            bans: this.bans.map(hero => hero.dataName),
            map: this.map
        }
    };
}
