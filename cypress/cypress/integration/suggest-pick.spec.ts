/// <reference types="cypress" />
// import Role from '@data/Role'
import Role from '../../../backend/src/data/Role'
import SuggestPickPage from "../components/SuggestPickPage";

context('suggest-pick', () => {
    it('evaluates all pick', () => {
        const page = new SuggestPickPage();
        page.open()
        page.selectHeroInRoster('ana')
        page.roster.allHeroesShouldBeShowing()
        page.selectHeroInRoster('lucio')
        page.roster.allHeroesShouldBeShowing()
        page.roster.allInRoleShouldBeDisabled(Role.Support)
        page.enemyPicksList.unselectHero('lucio')
        page.roster.roleShouldHaveAvailableHeroes(Role.Support)
        page.selectHeroInRoster('baptiste')
        page.selectHeroInRoster('reinhardt')
        page.selectHeroInRoster('roadhog')
        page.roster.allInRoleShouldBeDisabled(Role.Tank)
        page.selectHeroInRoster('soldier')
        page.selectHeroInRoster('pharah')
        page.roster.roleShouldHaveAvailableHeroes(Role.Tank)
        page.roster.roleShouldHaveAvailableHeroes(Role.Damage)
        page.roster.roleShouldHaveAvailableHeroes(Role.Support)
        page.selectHeroInRoster('ana')
        page.selectHeroInRoster('moira')
        page.roster.allInRoleShouldBeDisabled(Role.Support)
        page.selectHeroInRoster('mei')
        page.selectHeroInRoster('roadhog')
        page.selectHeroInRoster('widowmaker')
        page.roster.onlyRoleShouldBeShowing(Role.Tank)
        page.allyPicksList.unselectHero('mei')
        page.roster.roleShouldHaveAvailableHeroes(Role.Damage)
        page.roster.allInRoleShouldBeDisabled(Role.Support)
    })
    it('evaluates pre match pick', () => {
        const page = new SuggestPickPage();
        page.open()
        page.switchToPreMatch()
        page.selectHeroInRoster('ana')
        page.roster.allHeroesShouldBeShowing()
        page.selectHeroInRoster('lucio')
        page.roster.allInRoleShouldBeDisabled(Role.Support)
        page.allyPicksList.unselectHero('lucio')
        page.roster.roleShouldHaveAvailableHeroes(Role.Support)
        page.selectHeroInRoster('baptiste')
        page.selectHeroInRoster('reinhardt')
        page.selectHeroInRoster('roadhog')
        page.roster.allInRoleShouldBeDisabled(Role.Tank)
        page.selectHeroInRoster('soldier')
        page.roster.onlyRoleShouldBeShowing(Role.Damage)
        page.allyPicksList.unselectHero('ana')
        page.roster.roleShouldHaveAvailableHeroes(Role.Support)
        page.roster.roleShouldHaveAvailableHeroes(Role.Damage)
        page.roster.allInRoleShouldBeDisabled(Role.Tank)
    })
})

