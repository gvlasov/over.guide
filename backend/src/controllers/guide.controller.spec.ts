import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user.json"
import {TokenService} from "src/services/token.service";
import {AuthService} from "src/services/auth.service";
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import heroesFixture from "@fixtures/heroes.json";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import {GuideController} from "src/controllers/guide.controller";
import request from "supertest";
import {HttpStatus} from "@nestjs/common";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntry";
import HeroIds from "data/HeroIds";
import GuidePartTextDto from "data/dto/GuidePartText";
import GuidePartName from "data/dto/GuidePartName";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {ModerationService} from "src/services/moderation.service";
import GuideTheme from "data/GuideTheme";
import Map from "data/Map";

describe(
    GuideController,
    nestTest(
        GuideController,
        [],
        [TokenService, MatchupEvaluationService, AuthService, GuideHistoryEntryService, GuideDescriptorService, ModerationService],
        (ctx) => {
            it('user can create new guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        expect(res.body.guideId).toBe(1)
                    })
                expect((await Guide.findAll()).length).toBe(1)
            });
            it('user can update his existing guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect((await Guide.findAll()).length).toBe(1)
                const guide = await Guide.findOne()
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        guideId: guide.id,
                        descriptor: {
                            allyHeroes: [],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(2)
            });
            it('update with same content doesn\'t create new history entry', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    heroesFixture
                )
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [GuideTheme.Aim],
                            mapTags: [Map.Eichenwalde]
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect((await Guide.findAll()).length).toBe(1)
                const guide = await Guide.findOne()
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        guideId: guide.id,
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [GuideTheme.Aim],
                            mapTags: [Map.Eichenwalde]
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.ACCEPTED)
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
            });
            it('users cant edit each others guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user1 = await User.findOne();
                const user2 = await User.create({
                    name: 'Another dude',
                    battleNetUserId: '74563456986',
                })
                const tokenService = ctx.app.get(TokenService)
                const user1Token = tokenService.getToken(user1)
                const user2Token = tokenService.getToken(user2)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${user1Token}`})
                    .expect(HttpStatus.CREATED)
                const guide = await Guide.findOne()
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        guideId: guide.id,
                        descriptor: {
                            allyHeroes: [],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${user2Token}`})
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
            });
            it('moderator can edit other users guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const regularUser = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, regularUser)
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        guideId: guide.id,
                        descriptor: {
                            allyHeroes: [],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .set({Authorization: `Bearer ${moderatorToken}`})
                    .expect(HttpStatus.OK)
                expect((await Guide.findAll()).length).toBe(1)
                expect(
                    (await GuideHistoryEntry.findAll(
                        {where: {updaterId: regularUser.id}}
                    )).length
                ).toBe(1)
                expect(
                    (await GuideHistoryEntry.findAll(
                        {where: {updaterId: moderator.id}}
                    )).length
                ).toBe(1)
            });
            it('user can deactivate own guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await guide.reload()
                expect(guide.deactivatedById).toBe(user.id)
                expect(guide.deactivatedAt).not.toBe(null)
            });
            it('moderator can deactivate users\' guides ', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${moderatorToken}`})
                    .expect(HttpStatus.NO_CONTENT)
                await guide.reload()
                expect(guide.deactivatedById).toBe(moderator.id)
                expect(guide.deactivatedAt).not.toBe(null)
            });
            it('users can\'t deactivate each other\'s guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user1 = await User.findOne();
                const user2 = await User.create({
                    name: 'another dude',
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const user2Token = tokenService.getToken(user2)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user1)
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${user2Token}`})
                    .expect(HttpStatus.FORBIDDEN)
                await guide.reload()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
            });
            it('unauthenticated user can\'t create guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide')
                    .send({
                        descriptor: {
                            allyHeroes: [HeroIds.Baptiste],
                            playerHeroes: [HeroIds.McCree],
                            enemyHeroes: [HeroIds.Zarya],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(0)
            });
            it('deactivating non-existent guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const existingGuide = await Guide.findOne()
                expect(existingGuide.deactivatedById).toBe(null)
                expect(existingGuide.deactivatedAt).toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: existingGuide.id + 1})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NOT_FOUND)
                await existingGuide.reload()
                expect(existingGuide.deactivatedById).toBe(null)
                expect(existingGuide.deactivatedAt).toBe(null)
                expect((await Guide.findAll()).length).toBe(1)
            })
            it('user can reactivate guide if he deactivated it himself', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await guide.reload()
                expect(guide.deactivatedById).toBe(user.id)
                expect(guide.deactivatedAt).not.toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/activate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                await guide.reload()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
            })
            it('activating non-existent guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAndCountAll()).count).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide/activate')
                    .send({id: 1})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NOT_FOUND)
                expect((await Guide.findAndCountAll()).count).toBe(0)
            })
            it('activating active guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/activate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.METHOD_NOT_ALLOWED)
                await guide.reload()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
            })
            it('deactivating inactive guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                await guide.deactivate(user)
                expect(guide.deactivatedById).toBe(user.id)
                expect(guide.deactivatedAt).not.toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/deactivate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.METHOD_NOT_ALLOWED)
                await guide.reload()
                expect(guide.deactivatedById).toBe(user.id)
                expect(guide.deactivatedAt).not.toBe(null)
            })
            it('moderator can reactivate guide even if user deactivated it', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: GuidePartName.Text,
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: {
                        mapTags: [],
                        thematicTags: [],
                        enemyHeroes: [],
                        allyHeroes: [],
                        playerHeroes: [],
                    },
                }, user)
                const guide = await Guide.findOne()
                await guide.deactivate(user)
                expect(guide.deactivatedById).toBe(user.id)
                expect(guide.deactivatedAt).not.toBe(null)
                await request(ctx.app.getHttpServer())
                    .post('/guide/activate')
                    .send({id: guide.id})
                    .set({Authorization: `Bearer ${moderatorToken}`})
                    .expect(HttpStatus.NO_CONTENT)
                await guide.reload()
                expect(guide.deactivatedById).toBe(null)
                expect(guide.deactivatedAt).toBe(null)
            })
            afterAll(() => {
                ctx.app.close()
            })
        }
    )
)
