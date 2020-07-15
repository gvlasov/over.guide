import heroes from "data/heroes";
import Role from "data/Role"
import Hero from "data/dto/Hero"
import SeededShuffler from "@/js/SeededShuffler";

export default class BansGenerator {

    constructor(private readonly shuffler: SeededShuffler) {
    }

    generate(): Hero[] {
        const allHeroes = Array.from(heroes.values());
        const supports =
            this.shuffler.shuffle(
                allHeroes.filter(hero => hero.role === Role.Support),
            )
                .slice(0, 1);
        const tanks =
            this.shuffler.shuffle(
                allHeroes.filter(hero => hero.role === Role.Tank),
            )
                .slice(0, 1);
        const damage =
            this.shuffler.shuffle(
                allHeroes.filter(hero => hero.role === Role.Damage),
            )
                .slice(0, 2);
        return tanks.concat(damage).concat(supports);
    };

}
