import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import singleUserFixture from "@fixtures/single-user"
import {User} from "src/database/models/User";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import RestrictionTypeId from "data/RestrictionTypeId";
import {RestrictionService} from "src/services/restriction.service";

describe(
    RestrictionService,
    nestTest(RestrictionService, [], [], (ctx) => {
            it('tells if a user has an active restriction', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture
                )
                const defender = await User.findOne()
                const judge = await User.create({
                    name: 'judge',
                    battleNetUserId: '213535',
                    banned: 0,
                })
                const momentIn2Hours = new Date()
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        const activeRestriction = Restriction.create({
                            typeId: RestrictionTypeId.CommentCreationBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: momentIn2Hours.toISOString(),
                        })
                        const inactiveRestriction = Restriction.create({
                            typeId: RestrictionTypeId.ReportingBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: new Date('2020-10-01T00:00:00.000Z'),
                        })
                        return Promise.all([activeRestriction, inactiveRestriction])
                    })
                expect(
                    await ctx.service.hasActiveRestriction(
                        defender,
                        RestrictionTypeId.CommentCreationBan
                    )
                ).toStrictEqual(true)
                expect(
                    await ctx.service.hasActiveRestriction(
                        defender,
                        RestrictionTypeId.ReportingBan
                    )
                ).toStrictEqual(false)
            });
            it('other user restrictions don\'t apply to queried user', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture
                )
                const defender = await User.findOne()
                const judge = await User.create({
                    name: 'judge',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const otherUser = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                const momentIn2Hours = new Date()
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.CommentCreationBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: momentIn2Hours.toISOString(),
                        })
                    })
                await Sentence.create({
                    defenderId: otherUser.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.ReportingBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: momentIn2Hours.toISOString()
                        })
                    })
                expect(
                    await ctx.service.hasActiveRestriction(
                        defender,
                        RestrictionTypeId.CommentCreationBan
                    )
                ).toStrictEqual(true)
                expect(
                    await ctx.service.hasActiveRestriction(
                        defender,
                        RestrictionTypeId.ReportingBan
                    )
                ).toStrictEqual(false)
            });
        }
    )
)
