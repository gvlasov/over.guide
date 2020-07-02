const {I, Roster} = inject();
Feature('pick suggestion');
import Role from "../../backend/src/data/Role"

async function sleep() {
    await new Promise(resolve => setTimeout(resolve, 1000));
}

Scenario('suggests a pick', async (I) => {

    I.amOnPage('/')
    I.click('img[src="/images/roster-portraits/bastion.png"]')
    // Enemy team
    Roster.selectHeroFromRoster('bastion')
    Roster.selectHeroFromRoster('soldier')
    Roster.selectHeroFromRoster('ana')
    Roster.selectHeroFromRoster('lucio')
    Roster.selectHeroFromRoster('sigma')
    Roster.selectHeroFromRoster('reinhardt')
    // Ally team
    Roster.selectHeroFromRoster('bastion')
    Roster.selectHeroFromRoster('soldier')
    Roster.selectHeroFromRoster('ana')
    Roster.selectHeroFromRoster('lucio')
    Roster.selectHeroFromRoster('sigma')
    Roster.waitForOnlyRoleShowing(Role.Tank)
});
