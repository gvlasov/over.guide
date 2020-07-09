import Page from "./Page";

export default class BlizzardLoginPage extends Page {
    private email: string = 'bemor32621@estopg.com'
    private password: string = 'password123'

    constructor() {
        super('https://eu.battle.net/oauth/authorize');
    }

    locator = {
        allowButton() {
            return cy.get('#authorize')
        },
    }
}