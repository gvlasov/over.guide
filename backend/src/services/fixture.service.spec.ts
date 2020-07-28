import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import mapsFixture from "@fixtures/maps"
import {FixtureService} from "src/services/fixture.service";
import {Map} from "src/database/models/Map"

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
                await ctx.service.loadFixturesClear(singleUserFixture, mapsFixture)
                expect(
                    (await User.findOne()).name
                )
                    .toBe('testuser#123')
                expect(
                    (await Map.findAndCountAll()).count
                )
                    .not.toBe(0)
            });
        }
    )
)
