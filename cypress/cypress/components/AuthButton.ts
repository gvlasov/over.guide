import BlizzardLoginPage from "./BlizzardLoginPage";

export default class AuthButton {

    locator = {
        button() {
            return cy.get('.battle-net-button')
        },
    }

    auth() {
        const page = new BlizzardLoginPage()
        this.locator.button().click()
        cy.location('pathname', {timeout: 8000})
            .should('include', 'battle.net/');
        page.locator.allowButton().should('exist').then(
            button => button.click()
        )
    }


}