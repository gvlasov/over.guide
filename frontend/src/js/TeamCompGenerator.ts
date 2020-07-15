import heroes from "data/heroes";
import TeamComp from "./TeamComp";
import RoleGenerator from "./RoleGenerator";
import Hero from "data/dto/Hero";
import Role from "data/Role";
import SeededShuffler from "@/js/SeededShuffler";

export default class TeamCompGenerator {

    constructor(
        private readonly bans: Hero[],
        private readonly shuffler: SeededShuffler,
    ) {
    }

    generateForRole(yourRole: Role | null): TeamComp {

        const availableHeroes = Array.from(heroes.values())
            .filter(hero => !this.bans.includes(hero));
        const supports: (Hero | null)[] =
            this.shuffler.shuffle(
                availableHeroes.filter(hero => hero.role === Role.Support),
            )
                .slice(0, yourRole === Role.Support ? 1 : 2);
        if (yourRole === Role.Support) {
            supports.push(null);
        }
        const tanks: (Hero | null)[] =
            this.shuffler.shuffle(
                availableHeroes.filter(hero => hero.role === Role.Tank),
            )
                .slice(0, yourRole === Role.Tank ? 1 : 2);
        if (yourRole === Role.Tank) {
            tanks.push(null);
        }
        const damage: (Hero | null)[] =
            this.shuffler.shuffle(
                availableHeroes.filter(hero => hero.role === Role.Damage),
            )
                .slice(0, yourRole === Role.Damage ? 1 : 2);
        if (yourRole === Role.Damage) {
            damage.push(null);
        }
        return new TeamComp(tanks.concat(damage).concat(supports))
    };

    generateSeeded(): TeamComp {
        return this.generateForRole(
            new RoleGenerator(
                [Role.Tank, Role.Damage, Role.Support],
                this.shuffler
            ).generate()
        );
    };

    /**
     * Generate team composition with all 6 heroes
     */
    generateComplete(): TeamComp {
        return this.generateForRole(null);
    };
}

