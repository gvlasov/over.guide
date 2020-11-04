import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {MatchupEvaluationController} from "src/controllers/matchup-evaluation.controller";
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import {Patch} from "src/database/models/Patch";
import HeroId from "data/HeroId";

describe(
    MatchupEvaluationController,
    nestTest(
        MatchupEvaluationController,
        (ctx) => {
            it('creates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await Patch.create({
                    version: '1.3.21',
                    date: '2020-01-01 12:00:00',
                    title: 'fuck off',
                })
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send({
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: 4
                    })
                    .expect(HttpStatus.FORBIDDEN)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send({
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: 4
                    })
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(1)
            });
            it('updates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.create({
                    version: '1.3.21',
                    date: '2020-01-01 12:00:00',
                    title: 'fuck off',
                })
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
                    .send({
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: newScore
                    })
                    .expect(HttpStatus.FORBIDDEN)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toStrictEqual(1)
                expect(
                    (await MatchupEvaluation.findOne()).score
                ).toStrictEqual(oldScore)
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send({
                        subjectId: HeroId.Ana,
                        objectId: HeroId.Pharah,
                        score: newScore
                    })
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.ACCEPTED)
            });
            it('returns list of evaluations by user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const patch = await Patch.create({
                    version: '1.3.21',
                    date: '2020-01-01 12:00:00',
                    title: 'fuck off',
                })
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
        }
    )
)
