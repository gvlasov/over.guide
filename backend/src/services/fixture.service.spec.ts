import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user.json"
import devFixture from "@fixtures/dev.json"
import {FixtureService} from "src/services/fixture.service";
import {Ability} from "src/database/models/Ability";

describe(
    FixtureService,
    nestTest(FixtureService, [], [], (ctx) => {
            it('loads single fixture', async () => {
                await ctx.service.loadFixtureClear(singleUserFixture)
                expect(
                    (await User.findOne()).name
                )
                    .toBe('testuser#123')
            });
            it('loads multiple fixtures', async () => {
                await ctx.service.loadFixturesClear(singleUserFixture, devFixture)
                expect(
                    (await User.findOne()).name
                )
                    .toBe('testuser#123')
                expect(
                    (await Ability.findOne()).dataName
                )
                    .toBe('sleepdart')
            });
        }
    )
)
