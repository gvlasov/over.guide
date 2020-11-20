import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {MatchupEvaluationController} from "src/controllers/matchup-evaluation.controller";
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import heroesFixture from "@fixtures/heroes";
import patchFixture from "@fixtures/patchFixture";
import {HttpStatus} from "@nestjs/common";
import {Patch} from "src/database/models/Patch";
import HeroId from "data/HeroId";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";

describe(
    MatchupEvaluationController,
    nestTest(
        MatchupEvaluationController,
        (ctx) => {
            it('creates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, patchFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send([{
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: 4
                    }])
                    .expect(HttpStatus.FORBIDDEN)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send([{
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: 4
                    }])
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(1)
            });
            it('updates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, patchFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.findOne()
                const oldScore = 4;
                await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Pharah,
                    createdById: user.id,
                    score: oldScore,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(1)
                const newScore = oldScore - 1;
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send([{
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: newScore
                    }])
                    .expect(HttpStatus.FORBIDDEN)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(1)
                expect(
                    (await MatchupEvaluation.findOne()).score
                ).toStrictEqual(oldScore)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send([{
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: newScore
                    }])
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
            });
            it('returns list of evaluations by user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, patchFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.findOne()
                const anotherUser = await User.create({
                    name: "another user",
                    battleNetUserId: '34234234',
                    banned: 0,
                })
                await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Baptiste,
                    createdById: user.id,
                    score: 1,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Zenyatta,
                    createdById: user.id,
                    score: 1,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Baptiste,
                    createdById: anotherUser.id,
                    score: 2,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                await request(ctx.app.getHttpServer())
                    .get('/matchup-evaluation/my')
                    .send({
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: 4
                    })
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.length
                        ).toStrictEqual(2)
                    })
            })
            it('removes matchup evaluations', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, patchFixture)
                const user = await User.findOne();
                const anotherUser = await User.create({
                    name: "another user",
                    battleNetUserId: '34234234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.findOne()

                const userEvaluation1 = await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Zenyatta,
                    score: MatchupEvaluationUserScore.HardCountered,
                    createdById: user.id,
                    patchId: patch.id,
                    ip: '127.0.0.1',
                })
                const userEvaluation2 = await MatchupEvaluation.create({
                    subjectId: HeroId.Baptiste,
                    objectId: HeroId.Zenyatta,
                    score: MatchupEvaluationUserScore.Countered,
                    createdById: user.id,
                    patchId: patch.id,
                    ip: '127.0.0.1',
                })
                const userEvaluation3 = await MatchupEvaluation.create({
                    subjectId: HeroId.Echo,
                    objectId: HeroId.Reinhardt,
                    score: MatchupEvaluationUserScore.DontKnow,
                    createdById: user.id,
                    patchId: patch.id,
                    ip: '127.0.0.1',
                })
                const anotherUserEvaluation1 = await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Zenyatta,
                    score: MatchupEvaluationUserScore.HardCounters,
                    createdById: anotherUser.id,
                    patchId: patch.id,
                    ip: '127.0.0.1',
                })
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(4)
                await request(ctx.app.getHttpServer())
                    .post('/matchup-evaluation/remove')
                    .send([
                        [HeroId.Ana, HeroId.Zenyatta],
                        [HeroId.Baptiste, HeroId.Zenyatta],
                        [HeroId.Ana, HeroId.Zenyatta],
                    ])
                    .expect(HttpStatus.FORBIDDEN)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(4)
                await request(ctx.app.getHttpServer())
                    .post('/matchup-evaluation/remove')
                    .send([
                        [HeroId.Ana, HeroId.Zenyatta],
                        [HeroId.Baptiste, HeroId.Zenyatta],
                        [HeroId.Ana, HeroId.Zenyatta],
                    ])
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(2)
                await expect(async () => {
                    await userEvaluation1.reload()
                }).rejects.toThrow()
                await expect(async () => {
                    await userEvaluation2.reload()
                }).rejects.toThrow()
                userEvaluation3.reload();
                anotherUserEvaluation1.reload();
            });
            it('removes matchup evaluations when putting them with null score', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, patchFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.findOne()
                const oldScore = MatchupEvaluationUserScore.HardCounters;
                const newScore = MatchupEvaluationUserScore.Counters;
                const eval1 = await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Pharah,
                    createdById: user.id,
                    score: oldScore,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                const eval2 = await MatchupEvaluation.create({
                    subjectId: HeroId.Ana,
                    objectId: HeroId.Baptiste,
                    createdById: user.id,
                    score: MatchupEvaluationUserScore.DontKnow,
                    ip: '127.0.0.1',
                    patchId: patch.id,
                })
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(2)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send([
                        {
                            subjectId: HeroId.Ana,
                            objectId: HeroId.Pharah,
                            score: newScore // update
                        },
                        {
                            subjectId: HeroId.Ana,
                            objectId: HeroId.Baptiste,
                            score: null // delete
                        },
                        {
                            subjectId: HeroId.Zenyatta,
                            objectId: HeroId.Zarya,
                            score: MatchupEvaluationUserScore.HardCountered // create
                        },
                    ])
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(2)
                await eval1.reload()
                    .then((it) => {
                        expect(it.score).toStrictEqual(newScore)
                    });
                await expect(async () => {
                    await eval2.reload()
                }).rejects.toThrow()
            });
        }
    )
)
