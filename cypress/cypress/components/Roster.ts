import './Page'
import Role from "../../../backend/src/data/Role";
import HeroDto from "data/dto/HeroDto";
import heroes from "../../../backend/src/data/heroes";
import intersection from 'lodash.intersection'

export default class Roster {
    locator = {
        selectedPortrait() {
            return cy.get('.roster-portrait.selected')
        },
        hero(heroName: string) {
            return cy.get(`img[src="/images/roster-portraits/${heroName}.png"]`)
        },
        anyAvailableHero() {
            return cy.get(`.roster-portrait:not(.banned):first-of-type`)
        },
        heroesWithRole(role: Role) {
            return cy.get(
                Array.from<HeroDto>(heroes.values())
                    .filter(h => h.role === role)
                    .map(hero => `.roster-portrait[data-hero-data-name=${hero.dataName}]`)
                    .join(', ')
            )
        }
    }

    onlyRoleShouldBeShowing(role: Role) {
        cy.log(`Only role ${Role[role]} should be showing`)
        cy.get('.roster-portrait')
            .should(
                'have.length',
                Array.from<HeroDto>(heroes.values())
                    .filter((hero) => hero.role === role)
                    .length - 1 // assuming 1 hero is already picked
            )
    }

    allHeroesShouldBeShowing() {
        cy.log('All heroes should be showing')
        cy.get('.roster-portrait')
            .should(
                'have.length',
                Array.from<HeroDto>(heroes.values())
                    .length
            )
    }

    allInRoleShouldBeDisabled(role: Role) {
        cy.log(`all in role ${Role[role]} should be disabled`)
        this.locator.heroesWithRole(role)
            .should((portrait) => {
                portrait
                    .get()
                    .map(
                        (el) =>
                            intersection(
                                Cypress.$(el)[0].classList,
                                ['selected-out', 'banned']
                            )
                    )
                    .forEach(inter => {
                        expect(inter.length).to.be.greaterThan(0)
                    });
            })
    }

    roleShouldHaveAvailableHeroes(role: Role) {
        cy.log(`role ${Role[role]} should have available heroes`)
        this.locator.heroesWithRole(role)
            .should((portrait) => {
                const inters = portrait
                    .get()
                    .map(
                        (el) =>
                            intersection(
                                Cypress.$(el)[0].classList,
                                ['selected-out', 'banned']
                            )
                    );
                const intersections =
                    inters
                        .filter(i => i.length === 0);
                expect(intersections).to.not.be.empty
            })

    }

}
