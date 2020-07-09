import Role from "../../../backend/src/data/Role";
import Page from "./Page";
import Roster from "./Roster";

export default class CountersPracticePage extends Page {
    roster: Roster = new Roster()

    constructor() {
        super('/#/counters-practice');
    }

    locator = {
        roleCheckbox(role: Role) {
            return cy.get(`.role[data-role=${Role[role].toLowerCase()}]`)
        },
        approveButton() {
            return cy.get('.approve-button')
        },
        pickHero(heroName: string) {
            return cy.get(`img[src="/images/hero-portraits/${heroName}.png"]`)
        },
        nextChallengeButton() {
            return cy.get('.next-pick-button')
        }
    }

    selectRole(role: Role) {
        this.locator.roleCheckbox(role).click()
    }

    selectHeroInRoster(heroName: string) {
        this.roster.locator.hero(heroName).click()
        this.roster.locator.selectedPortrait()
    }
}