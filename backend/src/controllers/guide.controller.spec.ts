import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import heroesFixture from "@fixtures/heroes";
import abilitiesFixture from "@fixtures/abilities";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import {GuideController} from "src/controllers/guide.controller";
import request from "supertest";
import {HttpStatus} from "@nestjs/common";
import HeroId from "data/HeroId";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {ModerationService} from "src/services/moderation.service";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import Descriptor from "data/dto/GuideDescriptorQuickie";
import GuideSearchQueryQuickie from "data/dto/GuideSearchQueryQuickie";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import RestrictionTypeId from "data/RestrictionTypeId";
import ApiErrorId from "data/ApiErrorId";
import {GuideHead} from "src/database/models/GuideHead";

describe(
    GuideController,
    nestTest(
        GuideController,
        (ctx) => {
            it('gets guide by id', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body.guideHistoryEntry.guide.id).toBe(guide.id)
                    })
            });
            it('returns 404 if guide doesn\'t exist', async () => {
                await request(ctx.app.getHttpServer())
                    .get(`/guide/12341234`)
                    .expect(HttpStatus.NOT_FOUND)
            });
            it('returns 404 if guide is deactivated', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne({
                    include: [
                        {
                            model: User,
                            as: 'author',
                        }
                    ]
                })
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body.guideHistoryEntry.guide.id).toBe(guide.id)
                    })
                await guide.deactivate(guide.author)
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .expect(HttpStatus.NOT_FOUND)
            });
            it('user can create new guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide/create')
                    .send({
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Baptiste],
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
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
                    .post('/guide/create')
                    .send({
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Baptiste],
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect((await Guide.findAll()).length).toBe(1)
                const guide = await Guide.findOne()
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide/update')
                    .send({
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryAppendDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(2)
            });
            it('can\'t create guide with empty descriptor', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect((await Guide.findAll()).length).toBe(0)
                await request(ctx.app.getHttpServer())
                    .post('/guide/create')
                    .send({
                        descriptor: new Descriptor({}),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
                ;
                expect((await Guide.findAll()).length).toBe(0)
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
                    .post('/guide/create')
                    .send({
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Baptiste],
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                            thematicTags: [GuideTheme.Aim],
                            mapTags: [MapId.Eichenwalde]
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                expect((await Guide.findAll()).length).toBe(1)
                const guide = await Guide.findOne()
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide/update')
                    .send({
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Baptiste],
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                            thematicTags: [GuideTheme.Aim],
                            mapTags: [MapId.Eichenwalde]
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryAppendDto)
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
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const user1Token = tokenService.getToken(user1)
                const user2Token = tokenService.getToken(user2)
                await request(ctx.app.getHttpServer())
                    .post('/guide/create')
                    .send({
                        descriptor:
                            new Descriptor({
                                teammateHeroes: [HeroId.Baptiste],
                                playerHeroes: [HeroId.McCree],
                                enemyHeroes: [HeroId.Zarya],
                            }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
                    .set({Authorization: `Bearer ${user1Token}`})
                    .expect(HttpStatus.CREATED)
                const guide = await Guide.findOne()
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
                await request(ctx.app.getHttpServer())
                    .post('/guide/update')
                    .send({
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryAppendDto)
                    .set({Authorization: `Bearer ${user2Token}`})
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(1)
                expect((await GuideHistoryEntry.findAll()).length).toBe(1)
            });
            it('moderator can edit other users guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const regularUser = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        isPublic: true,
                    },
                    regularUser
                )
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .post('/guide/update')
                    .send({
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfm',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryAppendDto)
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
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Mei],
                        }),
                        isPublic: true
                    },
                    user
                )
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
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Ashe],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user1 = await User.findOne();
                const user2 = await User.create({
                    name: 'another dude',
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const user2Token = tokenService.getToken(user2)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            thematicTags: [GuideTheme.Psychology],
                        }),
                        isPublic: true,
                    },
                    user1
                )
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
                    .post('/guide/create')
                    .send({
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.Baptiste],
                            playerHeroes: [HeroId.McCree],
                            enemyHeroes: [HeroId.Zarya],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    } as GuideHistoryEntryCreateDto)
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(0)
            });
            it('deactivating non-existent guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Hanamura],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Eichenwalde],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana],
                        }),
                        isPublic: true,
                    },
                    user
                )
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
            it('searches for guides that have given tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana],
                            thematicTags: [GuideTheme['Game sense']],
                        }),
                        isPublic: true,
                    },
                    user
                )
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfman'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana],
                            thematicTags: [GuideTheme.Positioning],
                        }),
                        isPublic: true,
                    },
                    user
                )
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfman'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana, MapId.Hollywood],
                            thematicTags: [GuideTheme.Positioning],
                            enemyHeroes: [HeroId.Soldier],
                            teammateHeroes: [HeroId.Zarya, HeroId.Zenyatta],
                            playerHeroes: [HeroId.Dva],
                        }),
                        isPublic: true,
                    },
                    user
                )
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        mapTags: [MapId.Havana]
                    }))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(3)
                    })
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        teammateHeroes: [HeroId.Zarya, HeroId.Zenyatta],
                        playerHeroes: [HeroId.Dva],
                    }))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                    })
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({}))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(3)
                    })
            })
            it('finds only active guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const entry = await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana],
                            thematicTags: [GuideTheme['Game sense']],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        mapTags: [MapId.Havana],
                    }))
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                    });
                await entry.$get('guide')
                    .then(guide => guide.deactivate(user))
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        mapTags: [MapId.Havana]
                    }))
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        console.log(response.body)
                        expect(response.body.items.length).toBe(0)
                    })
            })
            it('search returns only guide heads', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const entry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'not head'}],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const guide = await entry.$get('guide');
                await service.append(
                    {
                        parts: [{kind: 'text', contentMd: 'HEAD'}],
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            mapTags: [MapId.Havana],
                        }),
                        isPublic: true,
                    },
                    user
                )
                await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'HEAD'}],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Eichenwalde],
                        }),
                        isPublic: true,
                    },
                    user
                )
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search`)
                    .send(new GuideSearchQueryQuickie({}))
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(2)
                        expect(
                            response.body.items.map(
                                (guide: ExistingGuideHeadDto) =>
                                    (guide.guideHistoryEntry.parts[0] as GuidePartTextDto).contentMd
                            )
                                .filter(it => it === 'HEAD')
                        ).toHaveLength(2)
                    })
            })
            it('can search by thematic tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const correctEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'not head'}],
                        descriptor: new Descriptor({
                            thematicTags: [GuideTheme.Communication],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const wrongEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            thematicTags: [GuideTheme.Aim],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const anotherEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(
                        new GuideSearchQueryQuickie({
                            thematicTags: [GuideTheme.Communication]
                        })
                    )
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                        expect(
                            response.body.items[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('can search by map tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            thematicTags: [GuideTheme.Aim],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const correctEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(
                        new GuideSearchQueryQuickie(
                            {
                                mapTags: [MapId.Busan],
                            }
                        )
                    )
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                        expect(
                            response.body.items[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('searches guides by heroes with and condition', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const correctEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou'}],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana, HeroId.Reinhardt],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search`)
                    .send(
                        new GuideSearchQueryQuickie(
                            {
                                playerHeroes: [HeroId.Ana, HeroId.Reinhardt],
                            }
                        )
                    )
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                        expect(
                            response.body.items[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('searches for guides by video', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                )
                const user = await User.findOne();
                const service = ctx.app.get(GuideHistoryEntryService);
                const commonVideoId = 'asdf';
                const guide1 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: commonVideoId,
                                startSeconds: 0,
                                endSeconds: 1,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const guide2 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: commonVideoId,
                                startSeconds: 1,
                                endSeconds: 2,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const guide3 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: `${commonVideoId}_DIFFERENT`,
                                startSeconds: 1,
                                endSeconds: 2,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search-by-video/${commonVideoId}`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body).toHaveLength(2)
                        const foundGuideIds = response.body.map(head => head.guideHistoryEntry.guide.id);
                        expect(foundGuideIds).toContain(guide1.id)
                        expect(foundGuideIds).toContain(guide2.id)
                        expect(foundGuideIds).not.toContain(guide3.id)
                    })
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search-by-video/NO_SUCH_VIDEO_ID`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body).toHaveLength(0)
                    })
            })
            it('searches for guides with exact descriptor', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou1'}],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const correctEntry = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou2'}],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search`)
                    .send(
                        new GuideSearchQueryQuickie(
                            {
                                playerHeroes: [HeroId.Ana],
                                exact: true,
                            }
                        )
                    )
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items.length).toBe(1)
                        expect(
                            response.body.items[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('can create private guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                await request(ctx.app.getHttpServer())
                    .post(`/guide/create`)
                    .send(
                        {
                            descriptor: new Descriptor({
                                teammateHeroes: [HeroId.Baptiste],
                                playerHeroes: [HeroId.McCree],
                                enemyHeroes: [HeroId.Zarya],
                            }),
                            parts: [
                                {
                                    kind: 'text',
                                    contentMd: 'asdf',
                                } as GuidePartTextDto
                            ],
                            isPublic: false,
                        } as GuideHistoryEntryCreateDto
                    )
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                    .then(async response => {
                        expect((await Guide.findOne(response.body.guideId)).isPublic).toBe(0)
                    })
            })
            it('user can view his own private guide', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        isPublic: false,
                    },
                    user
                )
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
            })
            it('user can\'t view others\' private guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const anotherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const token = ctx.app.get(TokenService).getToken(anotherUser)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        isPublic: false,
                    },
                    user
                )
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.FORBIDDEN)
            })
            it('doesn\'t list private guides in search', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const service = ctx.app.get(GuideHistoryEntryService);
                const user = await User.findOne();
                const privateGuide = await service.create(
                    {
                        parts: [{kind: 'text', contentMd: 'hellou1'}],
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                        }),
                        isPublic: false,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search`)
                    .send(
                        new GuideSearchQueryQuickie({})
                    )
                    .expect(HttpStatus.OK)
                    .then(response => {
                        for (let guide of response.body.items) {
                            expect(guide.guideHistoryEntry.isPublic)
                            expect(guide.guideHistoryEntry.guide.id).not.toStrictEqual(privateGuide.id)
                        }
                    })
            })
            it('moderator can view private guides', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                const regularUser = await User.findOne();
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => user.name.includes('moderator')
                    )
                const moderator = await User.create({
                    name: 'moderator user',
                    battleNetUserId: '983724587234',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        isPublic: false,
                    },
                    regularUser
                )
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .get(`/guide/${guide.id}`)
                    .set({Authorization: `Bearer ${moderatorToken}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.guideHistoryEntry.guide.id
                        )
                            .toStrictEqual(guide.id)
                    })
            });
            it('can update guide from private to public', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf'
                            } as GuidePartTextDto
                        ],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        isPublic: false,
                    },
                    user
                )
                const guide = await Guide.findOne()
                expect(guide.isPublic).toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .post(`/guide/update`)
                    .set({Authorization: `Bearer ${token}`})
                    .send({
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        parts: [
                            {
                                contentMd: 'asdf',
                                kind: 'text',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                        guideId: guide.id,
                    } as GuideHistoryEntryAppendDto)
                    .expect(HttpStatus.OK)
                    .then(response =>
                        guide.reload()
                    )
                    .then(
                        guide => {
                            expect(guide.isPublic).toStrictEqual(1)
                        }
                    )
            });
            it('guide forced to be private can\'t be changed to public', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne();
                const judge = await User.create({
                    name: 'judge',
                    battleNetUserId: '123',
                    banned: 0,
                })
                const token = ctx.app.get(TokenService).getToken(defender)
                const guide = await Guide.findOne()
                guide.isPublic = 0
                await guide.save()
                await guide.reload()
                expect(guide.isPublic).toStrictEqual(0)
                const momentIn2Hours = new Date();
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.ForceGuidePrivate,
                            objectId: guide.id,
                            sentenceId: sentence.id,
                            start: new Date().toISOString(),
                            end: momentIn2Hours.toISOString(),
                        })
                    })
                const newContent = 'NEW CONTENT';
                await request(ctx.app.getHttpServer())
                    .post(`/guide/update`)
                    .set({Authorization: `Bearer ${token}`})
                    .send({
                        descriptor: new Descriptor({
                            mapTags: [MapId.Dorado],
                        }),
                        parts: [
                            {
                                contentMd: newContent,
                                kind: 'text',
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                        guideId: guide.id,
                    } as GuideHistoryEntryAppendDto)
                    .expect(HttpStatus.FORBIDDEN)
                    .then(
                        response => {
                            expect(response.body.error).toStrictEqual(ApiErrorId.GuideForcedToBePrivate)
                            return guide.reload()
                        }
                    )
                    .then(
                        async guide => {
                            expect(guide.isPublic).toStrictEqual(0)
                            expect(
                                await GuideHead.findOne({
                                    where: {
                                        guideId: guide.id,
                                    },
                                    include: GuideHead.includesForDto(),
                                })
                                    .then(head => {
                                        return head.guideHistoryEntry.guidePartTexts[0].contentMd
                                    })
                            )
                                .not.toStrictEqual(newContent)
                        }
                    )
            });
            it('searches for guides by author', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                )
                const user = await User.findOne();
                const anotherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '88884848',
                    banned: 0,
                });
                const service = ctx.app.get(GuideHistoryEntryService);
                const guide1 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: 'jijij',
                                startSeconds: 0,
                                endSeconds: 1,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                const guide2 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: 'ds8ud8sy88f',
                                startSeconds: 1,
                                endSeconds: 2,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    anotherUser
                ) as GuideHistoryEntry
                const guide3 = await service.create(
                    {
                        parts: [{
                            kind: 'video',
                            excerpt: {
                                youtubeVideoId: '8ujsdfhus',
                                startSeconds: 1,
                                endSeconds: 2,
                                thumbnail: null,
                            }
                        }],
                        descriptor: new Descriptor({
                            mapTags: [MapId.Busan],
                        }),
                        isPublic: true,
                    },
                    user
                ) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search-by-author`)
                    .send({
                        authorId: user.id,
                        clientAlreadyHasGuideIds: [],
                    })
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items).toHaveLength(2)
                        const foundGuideIds = response.body.items.map(head => head.guideHistoryEntry.guide.id);
                        expect(foundGuideIds).toContain(guide1.id)
                        expect(foundGuideIds).not.toContain(guide2.id)
                        expect(foundGuideIds).toContain(guide3.id)
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search-by-author`)
                    .send({
                        authorId: user.id,
                        clientAlreadyHasGuideIds: [guide1.id],
                    })
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items).toHaveLength(1)
                        const foundGuideIds = response.body.items.map(head => head.guideHistoryEntry.guide.id);
                        expect(foundGuideIds).not.toContain(guide1.id)
                        expect(foundGuideIds).not.toContain(guide2.id)
                        expect(foundGuideIds).toContain(guide3.id)
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search-by-author`)
                    .send({
                        authorId: anotherUser.id,
                        clientAlreadyHasGuideIds: [],
                    })
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.items).toHaveLength(1)
                        const foundGuideIds = response.body.items.map(head => head.guideHistoryEntry.guide.id);
                        expect(foundGuideIds).not.toContain(guide1.id)
                        expect(foundGuideIds).toContain(guide2.id)
                        expect(foundGuideIds).not.toContain(guide3.id)
                    })
            })
        }
    )
)
