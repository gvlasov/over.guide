import './Page'

export default class PicksList {
    constructor(private readonly position: number) {
    }

    locator = {
        heroPortrait: (heroName: string) => {
            return cy.get(`.picks-list:nth-of-type(${this.position}) img[data-hero-data-name=${heroName}]`).should('exist').and('be.visible')
        },
    }

    unselectHero(heroName: string) {
        this.locator.heroPortrait(heroName).click()
    }

}
