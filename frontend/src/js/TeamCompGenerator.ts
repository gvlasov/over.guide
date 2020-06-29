import heroes from "data/heroes";
import seedrandom from "seedrandom";
import shuffle from "fast-shuffle";
import TeamComp from "./TeamComp";
import RoleGenerator from "./RoleGenerator";
import Hero from "data/dto/Hero";
import Role from "data/Role";

export default class TeamCompGenerator {
    private bans: Hero[];

    constructor(bans: Hero[]) {
        this.bans = bans;
    }

    generateForRole(yourRole: Role | null, seed: string): TeamComp {
        let random = seedrandom(seed);
        const availableHeroes = Array.from(heroes.values())
            .filter(hero => !this.bans.includes(hero));
        const supports: (Hero | null)[] =
            shuffle(
                availableHeroes.filter(hero => hero.role === Role.Support),
                () => random()
            )
                .slice(0, yourRole === Role.Support ? 1 : 2);
        if (yourRole === Role.Support) {
            supports.push(null);
        }
        const tanks: (Hero | null)[] =
            shuffle(
                availableHeroes.filter(hero => hero.role === Role.Tank),
                () => random()
            )
                .slice(0, yourRole === Role.Tank ? 1 : 2);
        if (yourRole === Role.Tank) {
            tanks.push(null);
        }
        const damage: (Hero | null)[] =
            shuffle(
                availableHeroes.filter(hero => hero.role === Role.Damage),
                () => random()
            )
                .slice(0, yourRole === Role.Damage ? 1 : 2);
        if (yourRole === Role.Damage) {
            damage.push(null);
        }
        return new TeamComp(tanks.concat(damage).concat(supports))
    };

    generateSeeded(seed: string): TeamComp {
        return this.generateForRole(
            new RoleGenerator([Role.Tank, Role.Damage, Role.Support]).generate(seed),
            seed
        );
    };

    /**
     * Generate team composition with all 6 heroes
     */
    generateComplete(seed: string): TeamComp {
        return this.generateForRole(null, seed);
    };
}

