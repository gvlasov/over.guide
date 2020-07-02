const {I} = inject();

export function selectHeroFromRoster(heroName: string) {
    I.click('img[src="/images/roster-portraits/' + heroName + '.png"]')
    I.waitForVisible('img[src="/images/hero-portraits/' + heroName + '.png"]')
}
