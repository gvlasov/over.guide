import Page from "./Page";
import Roster from "./Roster";
import PicksList from "./PicksList";

export default class SuggestPickPage extends Page {
    roster: Roster = new Roster()
    enemyPicksList: PicksList = new PicksList(1)
    allyPicksList: PicksList = new PicksList(2)

    constructor() {
        super('/#/suggest-pick');
    }

    locator = {
        pickHero(heroName: string) {
            return cy.get(`img[src="/images/hero-portraits/${heroName}.png"]`)
        },
        modeChangeButton() {
            return cy.get('.mode-change-button')
        }
    }

    selectHeroInRoster(heroName: string) {
        this.roster.locator.hero(heroName).click()
    }

    switchToPreMatch() {
        this.locator.modeChangeButton().click()
    }
}