import Role from "data/Role"
import HeroDto from "data/dto/HeroDto"
import heroes from 'data/heroes';

export default class HeroGroupsByRole {

    public static ALL: HeroGroupsByRole = new HeroGroupsByRole(
        Array.from(heroes.values())
    )

    constructor(private readonly heroes: HeroDto[]) {
    }

    get tanks(): HeroDto[] {
        return this.heroes.filter(h => h.role === Role.Tank);
    }

    get damageRow1(): HeroDto[] {
        const damages = this.heroes.filter(h => h.role === Role.Damage);
        return damages.slice(0, damages.length / 2);
    }

    get damageRow2(): HeroDto[] {
        const damages = this.heroes.filter(h => h.role === Role.Damage);
        return damages.slice(damages.length / 2);
    }

    get supports(): HeroDto[] {
        return this.heroes.filter(h => h.role === Role.Support);
    }

    get groups(): HeroDto[][] {
        return [
            this.tanks,
            this.damageRow1,
            this.damageRow2,
            this.supports
        ]
    }

}
