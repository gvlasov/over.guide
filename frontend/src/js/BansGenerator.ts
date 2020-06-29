import heroes from "data/heroes";
import seedrandom from "seedrandom";
import shuffle from "fast-shuffle";
import Role from "data/Role"
import Hero from "data/dto/Hero"

export default class BansGenerator {

    generate(seed: string): Hero[] {
        const random = seedrandom(seed + 1000000);
        const allHeroes = Array.from(heroes.values());
        const supports =
            shuffle(
                allHeroes.filter(hero => hero.role === Role.Support),
                () => random()
            )
                .slice(0, 1);
        const tanks =
            shuffle(
                allHeroes.filter(hero => hero.role === Role.Tank),
                () => random()
            )
                .slice(0, 1);
        const damage =
            shuffle(
                allHeroes.filter(hero => hero.role === Role.Damage),
                () => random()
            )
                .slice(0, 2);
        return tanks.concat(damage).concat(supports);
    };

}
