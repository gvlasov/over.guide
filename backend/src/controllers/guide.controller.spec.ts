import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import {AuthService} from "src/services/auth.service";
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
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
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {ModerationService} from "src/services/moderation.service";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideSearchService} from "src/services/guide-search.service";
import Descriptor from "data/dto/GuideDescriptorQuickie";
import GuideSearchQueryQuickie from "data/dto/GuideSearchQueryQuickie";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import GuideHeadDto from "data/dto/GuideHeadDto";

describe(
    GuideController,
    nestTest(
        GuideController,
        [],
        [TokenService, MatchupEvaluationService, AuthService, GuideHistoryEntryService, GuideDescriptorService, ModerationService, ContentHashService, GuideSearchService],
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
                        console.log(res.body)
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                        ]
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
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Dorado],
                    }),
                } as GuideHistoryEntryCreateDto, regularUser)
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
                        ]
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
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        teammateHeroes: [HeroId.Mei],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        teammateHeroes: [HeroId.Ashe],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const user2Token = tokenService.getToken(user2)
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Psychology],
                    }),
                } as GuideHistoryEntryCreateDto, user1)
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
                        ]
                    } as GuideHistoryEntryCreateDto)
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(0)
            });
            it('deactivating non-existent guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Hanamura],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                    battleNetUserId: '983724587234'
                })
                const tokenService = ctx.app.get(TokenService)
                const moderatorToken = tokenService.getToken(moderator)
                await ctx.app.get(GuideHistoryEntryService).create({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
                } as GuideHistoryEntryCreateDto, user)
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
                await ctx.app.get(GuideHistoryEntryService).create({
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
                } as GuideHistoryEntryCreateDto, user)
                await ctx.app.get(GuideHistoryEntryService).create({
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
                } as GuideHistoryEntryCreateDto, user)
                await ctx.app.get(GuideHistoryEntryService).create({
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
                } as GuideHistoryEntryCreateDto, user)
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        mapTags: [MapId.Havana]
                    }))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(3)
                    })
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        teammateHeroes: [HeroId.Zarya, HeroId.Zenyatta],
                        playerHeroes: [HeroId.Dva],
                    }))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                    })
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({}))
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(3)
                    })
            })
            it('doesn\'t find deactivated guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const entry = await ctx.app.get(GuideHistoryEntryService).create({
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
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .post('/guide/search')
                    .send(new GuideSearchQueryQuickie({
                        mapTags: [MapId.Havana],
                    }))
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
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
                        expect(response.body.guides.length).toBe(0)
                    })
            })
            it('search returns only guide heads', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const entry = await service.create({
                    parts: [{kind: 'text', contentMd: 'not head'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Havana],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const guide = await entry.$get('guide');
                await service.append({
                    parts: [{kind: 'text', contentMd: 'HEAD'}],
                    guideId: guide.id,
                    descriptor: new Descriptor({
                        mapTags: [MapId.Havana],
                    }),
                } as GuideHistoryEntryAppendDto, user)
                await service.create({
                    parts: [{kind: 'text', contentMd: 'HEAD'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                    }),
                } as GuideHistoryEntryCreateDto, user)
                await request(ctx.app.getHttpServer())
                    .post(`/guide/search`)
                    .send(new GuideSearchQueryQuickie({}))
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(2)
                        expect(
                            response.body.guides.map(
                                (guide: GuideHeadDto) =>
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
                const correctEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'not head'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Communication],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const wrongEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Aim],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const anotherEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
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
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('can search by map tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Aim],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const correctEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
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
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('searches guides by heroes with and condition', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const correctEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana, HeroId.Reinhardt],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
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
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideHistoryEntry.guide.id
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
                const guide1 = await service.create({
                    parts: [{
                        kind: 'video',
                        excerpt: {
                            youtubeVideoId: commonVideoId,
                            startSeconds: 0,
                            endSeconds: 1,
                        }
                    }],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const guide2 = await service.create({
                    parts: [{
                        kind: 'video',
                        excerpt: {
                            youtubeVideoId: commonVideoId,
                            startSeconds: 1,
                            endSeconds: 2,
                        }
                    }],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const guide3 = await service.create({
                    parts: [{
                        kind: 'video',
                        excerpt: {
                            youtubeVideoId: `${commonVideoId}_DIFFERENT`,
                            startSeconds: 1,
                            endSeconds: 2,
                        }
                    }],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search-by-video/${commonVideoId}`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body).toHaveLength(2)
                        console.log(response.body)
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
                const wrongEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou1'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
                const correctEntry = await service.create({
                    parts: [{kind: 'text', contentMd: 'hellou2'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
                } as GuideHistoryEntryCreateDto, user) as GuideHistoryEntry
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
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideHistoryEntry.guide.id
                        ).toBe(correctEntry.guideId)
                    })
            })

            afterAll(() => {
                ctx.app.close()
            })
        }
    )
)
