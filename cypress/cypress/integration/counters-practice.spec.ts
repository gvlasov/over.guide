/// <reference types="cypress" />
import CountersPracticePage from "../components/CountersPracticePage";
import Role from '../../../backend/src/data/Role'

context.only('counters-practice', () => {
    it('evaluates pick', () => {
        const page = new CountersPracticePage();
        page.open()
        page.selectRole(Role.Support)
        page.locator.approveButton().click()
        const heroItem = page.roster.locator.anyAvailableHero();
        heroItem.click()
        page.roster.locator.selectedPortrait()
            .should('be.visible')
        page.locator.nextChallengeButton().click()
        page.roster.locator.selectedPortrait().should('not.exist')
    })
})

