import {TokenService} from "src/services/token.service";
import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"

describe(
    TokenService,
    nestTest(TokenService, [], [], (ctx) => {
            it('creates token from user', async () => {
                await ctx.fixtures(singleUserFixture)
                const token = ctx.service.getToken((await User.findOne()));
                expect(token.length).toBeGreaterThan(20)
                expect(token[token.length - 1]).toBe("=")
            });
            it('creates user from token', async () => {
                await ctx.fixtures(singleUserFixture)
                const user = await User.findOne()
                const token = ctx.service.getToken(user);
                expect(
                    (await ctx.service.getUser(token)).battleNetUserId
                ).toBe(user.battleNetUserId)
            });
            it('returns null if there is no such user', async () => {
                await ctx.fixtures(singleUserFixture)
                const user = await User.findOne()
                const token = ctx.service.getToken(user);
                expect(
                    (await ctx.service.getUser('asdf'))
                ).toBe(null)
            });
        }
    )
)
