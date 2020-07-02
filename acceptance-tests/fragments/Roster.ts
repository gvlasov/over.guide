const {I} = inject();

import Role from "data/Role"
import Hero from "data/dto/Hero";
import heroes from "../../backend/src/data/heroes"

export function selectHeroFromRoster(heroName: string) {
    I.click(rosterHeroLocator(heroName))
    I.waitForVisible(
        'img[src="/images/hero-portraits/' + heroName + '.png"]'
    )
}

export function rosterHeroLocator(heroName: string) {
    return 'img[src="/images/roster-portraits/' + heroName + '.png"]'
}

export function waitForOnlyRoleShowing(role: Role) {
    I.waitNumberOfVisibleElements(
        '.roster-portrait',
        Array.from<Hero>(heroes.values())
            .filter((hero) => hero.role === role)
            .length - 1 // assuming 1 hero is already picked
    )
}
