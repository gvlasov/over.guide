import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {MatchupEvaluationController} from "src/controllers/matchup-evaluation.controller";
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import {AuthService} from "src/services/auth.service";
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import heroesFixture from "@fixtures/heroes";
import {Hero} from "src/database/models/Hero";
import {HttpStatus} from "@nestjs/common";

describe(
    MatchupEvaluationController,
    nestTest(
        MatchupEvaluationController,
        [],
        [TokenService, MatchupEvaluationService, AuthService],
        (ctx) => {
            it('creates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toBe(0)
                await request(ctx.app.getHttpServer())
                    .get('/test')
                await request(ctx.app.getHttpServer())
                    .put('/matchup-evaluation')
                    .send({subject: 'ana', object: 'pharah', score: 4})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect(
                    (await MatchupEvaluation.findAll()).length
                ).toBe(1)
            });
            it('updates matchup evaluation as logged in user', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                MatchupEvaluation.create({
                    id: 1,
                    subjectId: (await Hero.findOne({where: {dataName: 'ana'}})).id,
                    objectId: (await Hero.findOne({where: {dataName: 'pharah'}})).id,
                    score: 4,
                })
            });
            it('fails to create matchup evaluation as not logged in user', async () => {
                await ctx.fixtures(singleUserFixture)
            });
            afterAll(() => {
                ctx.app.close()
            })
        }
    )
)
