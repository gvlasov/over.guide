import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import smallGuideTestingFixture from "@fixtures/small-guide-testing"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {AuthService} from "src/services/auth.service";
import heroesFixture from "@fixtures/heroes";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import abilitiesFixture from "@fixtures/abilities";
import {HttpStatus} from "@nestjs/common";
import {TrainingGoalController} from "src/controllers/training-goal.controller";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {Op} from "sequelize";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import HeroId from "data/HeroId";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";

describe(
    TrainingGoalController,
    nestTest(
        TrainingGoalController,
        [],
        [AuthService, TokenService, GuideHistoryEntryService, ContentHashService, GuideDescriptorService],
        (ctx) => {
            it('adds and removes training goals', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const guide1 = await Guide.findOne()
                const guide2 = await Guide.findOne({
                    where: {[Op.not]: {id: guide1.id}},
                })
                expect(user.trainingGoals).toHaveLength(0)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(1)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide2.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(2)
                expect(user.trainingGoals[0].User2TrainingGoal.order).toBe(0)
                expect(user.trainingGoals[1].User2TrainingGoal.order).toBe(1)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(1)
            });
            it('doesn\'t remove training goal if target goal doesn\'t exist', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const guide1 = await Guide.findOne()
                const guide2 = await Guide.findOne({
                    where: {[Op.not]: {id: guide1.id}},
                })
                expect(user.trainingGoals).toHaveLength(0)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(0)
                await User2TrainingGoal.create({
                    userId: user.id,
                    guideId: guide1.id,
                    order: 1
                })
                await user.reload()
                expect(user.trainingGoals).toHaveLength(1)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/${guide2.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(1)
            });
            it('doesn\'t remove training goals of another user', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const authorizedUser = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const anotherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '1231241241243',
                }, {
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(authorizedUser)
                const guide1 = await Guide.findOne()
                await User2TrainingGoal.create({
                    userId: anotherUser.id,
                    guideId: guide1.id,
                    order: 1
                })
                await anotherUser.reload()
                await authorizedUser.reload()
                expect(authorizedUser.trainingGoals).toHaveLength(0)
                expect(anotherUser.trainingGoals).toHaveLength(1)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await authorizedUser.reload()
                await anotherUser.reload()
                expect(anotherUser.trainingGoals).toHaveLength(1)
                expect(authorizedUser.trainingGoals).toHaveLength(0)
            });
            it('fails when trying to add non-existent guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect(user.trainingGoals).toHaveLength(0)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/9999`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NOT_FOUND)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(0)
            });
            it('doesn\'t error when trying to remove non-existent guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect(user.trainingGoals).toHaveLength(0)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/9999`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await user.reload()
                expect(user.trainingGoals).toHaveLength(0)
            });
            it('lists user\'s guides', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const guide1 = await Guide.findOne()
                await User2TrainingGoal.create({
                    userId: user.id,
                    guideId: guide1.id,
                    order: 1
                })
                await request(ctx.app.getHttpServer())
                    .get(`/my-training-goals`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(response.body.length).toBe(1)
                    })
            });
            it('doesn\'t allow access for unauthenticated users', async () => {
                await request(ctx.app.getHttpServer())
                    .get(`/my-training-goals`)
                    .expect(HttpStatus.FORBIDDEN)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/reorder`)
                    .expect(HttpStatus.FORBIDDEN)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/123`)
                    .expect(HttpStatus.FORBIDDEN)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/123`)
                    .expect(HttpStatus.FORBIDDEN)
            });
            it('can\'t add same training goal multiple times', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const guide1 = await Guide.findOne()
                await User2TrainingGoal.create({
                    userId: user.id,
                    guideId: guide1.id,
                    order: 1
                })
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.BAD_REQUEST)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.BAD_REQUEST)
                await request(ctx.app.getHttpServer())
                    .delete(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${guide1.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.BAD_REQUEST)
            });
            it('can add training goal at certain place in the list', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService);
                const token = tokenService.getToken(user);
                (await Guide.findAll()).forEach(async guide => {
                    await User2TrainingGoal.create({
                        userId: user.id,
                        guideId: guide.id,
                        order: guide.id * 2,
                    })
                })
                const newGuide = await ctx.app.get(GuideHistoryEntryService)
                    .save({
                            descriptor: new GuideDescriptorQuickie({
                                playerHeroes: [HeroId.Genji],
                            }),
                            parts: [
                                {
                                    contentMd: 'asdf89877',
                                    kind: 'text'
                                } as GuidePartTextDto
                            ]
                        } as GuideHistoryEntryDto,
                        user
                    ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post(`/my-training-goals/${newGuide.guideId}`)
                    .set({Authorization: `Bearer ${token}`})
                    .send({order: 1})
                    .expect(HttpStatus.CREATED)
                await request(ctx.app.getHttpServer())
                    .get(`/my-training-goals`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.map(item => item.order)
                        ).toStrictEqual([6, 4, 2, 1])
                    })
            });
            it('reorders goals', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({
                    include: [{
                        model: Guide,
                        as: 'trainingGoals'
                    }]
                });
                const tokenService = ctx.app.get(TokenService);
                const token = tokenService.getToken(user);
                (await Guide.findAll()).forEach(async guide => {
                    await User2TrainingGoal.create({
                        userId: user.id,
                        guideId: guide.id,
                        order: guide.id,
                    })
                });
                await request(ctx.app.getHttpServer())
                    .post('/my-training-goals/reorder')
                    .set({Authorization: `Bearer ${token}`})
                    .send([2, 1, 3])
                    .expect(HttpStatus.NO_CONTENT)
                await request(ctx.app.getHttpServer())
                    .get(`/my-training-goals`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.map(item => item.guide.guideId)
                        ).toStrictEqual([2, 1, 3])
                    })
            });
        }
    )
)