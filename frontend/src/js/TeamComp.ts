import uniq from "lodash/uniq";
import Vue from 'vue';
import heroes from "data/heroes";
import HeroDto from "data/dto/HeroDto"
import Role from "data/Role"
import _ from 'lodash'

export default class TeamComp {

    readonly heroes: (HeroDto | null)[];

    constructor(heroes: (HeroDto | null)[]) {
        if (heroes.length !== 6) {
            throw new Error(
                "There must be exactly 6 positions, but there are " + heroes.length
            )
        }
        const picks =
            heroes
                .filter<HeroDto>((hero): hero is HeroDto => hero !== null)
                .map(hero => hero.name);
        if (uniq(picks).length < picks.length) {
            throw new Error(
                "Heroes in a team composition must be unique"
            );
        }
        this.heroes = heroes;
    }

    getCompletelyPickedCategories(): Role[] {
        let tanks = 0,
            supports = 0,
            damage = 0;
        let roles: Role[] = this.heroes
            .filter<HeroDto>((it): it is HeroDto => it !== null)
            .map<Role>((hero: HeroDto) => hero.role);
        for (let role of roles) {
            if (role === Role.Tank) {
                tanks++;
            } else if (role === Role.Support) {
                supports++;
            } else if (role === Role.Damage) {
                damage++;
            } else {
                throw new Error('Unknown role ' + role)
            }
        }
        let answer = [];
        if (supports === 2) {
            answer.push(Role.Support);
        }
        if (damage === 2) {
            answer.push(Role.Damage);
        }
        if (tanks === 2) {
            answer.push(Role.Tank);
        }
        return answer;
    };

    remainingRoles(): Role[] {
        const pickedRoles = this.getCompletelyPickedCategories();
        return _.difference([Role.Support, Role.Damage, Role.Tank], pickedRoles);
    };

    remainingRole(): Role {
        const remainingRoles = this.remainingRoles();
        if (remainingRoles.length !== 1) {
            throw new Error("More than 1 role remaining: " + remainingRoles.join(', '));
        }
        return remainingRoles[0];
    };

    setNextAvailable(hero: HeroDto) {
        const position = this.getNextVacancyForRole(hero.role);
        if (position === null) {
            throw new Error('No position at role ' + hero.role);
        }
        this.setAtPosition(position, hero);
    };

    setAtPosition(position: number, hero: HeroDto | null) {
        if (position < 0 || position > 5) {
            throw new Error("Position must be in 0..5");
        }
        if (hero !== null) {
            if (hero.role === Role.Tank && position !== 0 && position !== 1) {
                throw new Error('Tanks can only be set at positions 0 and 1');
            } else if (hero.role === Role.Damage && position !== 2 && position !== 3) {
                throw new Error('Tanks can only be set at positions 2 and 3');
            } else if (hero.role === Role.Support && position !== 4 && position !== 5) {
                throw new Error('Tanks can only be set at positions 4 and 5');
            }
        }
        Vue.set(this.heroes, position, hero);
    };

    numberOfVacancies(): number {
        return this.heroes.filter(h => h === null).length;
    };

    unsetAtPosition(position: number) {
        this.setAtPosition(position, null);
    };


    getNextVacancyForRole(role: Role): number | null {
        if (role === Role.Tank) {
            if (this.heroes[0] === null) {
                return 0;
            } else if (this.heroes[1] === null) {
                return 1;
            }
        } else if (role === Role.Damage) {
            if (this.heroes[2] === null) {
                return 2;
            } else if (this.heroes[3] === null) {
                return 3;
            }
        } else if (role === Role.Support) {
            if (this.heroes[4] === null) {
                return 4;
            } else if (this.heroes[5] === null) {
                return 5;
            }
        }
        return null;
    };

    hasVacancyForRole(role: Role): boolean {
        return this.getNextVacancyForRole(role) !== null;
    };

    canSelect(hero: HeroDto): boolean {
        return this.hasVacancyForRole(hero.role)
            && typeof this.heroes.find(h => h !== null && h.dataName === hero.dataName) === 'undefined';
    };

    isFull(): boolean {
        for (let hero of this.heroes) {
            if (hero === null) {
                return false;
            }
        }
        return true;
    };

    heroesInPickedOutRoles(): HeroDto[] {
        const result = [];
        for (let role of this.getCompletelyPickedCategories()) {
            for (let hero of heroes.values()) {
                if (hero.role === role) {
                    result.push(hero);
                }
            }
        }
        return result;
    };

    picks(): HeroDto[] {
        return this.heroes.filter((h): h is HeroDto => h !== null);
    };

    static empty(): TeamComp {
        return new TeamComp([null, null, null, null, null, null]);
    };

}
