import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import {AuthService} from "src/services/auth.service";
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import heroesFixture from "@fixtures/heroes";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import {GuideController} from "src/controllers/guide.controller";
import request from "supertest";
import {HttpStatus} from "@nestjs/common";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
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
import {
    GuideSearchQuery,
    GuideSearchService
} from "src/services/guide-search.service";
import Descriptor from "data/dto/GuideDescriptorQuickie";

describe(
    GuideController,
    nestTest(
        GuideController,
        [],
        [TokenService, MatchupEvaluationService, AuthService, GuideHistoryEntryService, GuideDescriptorService, ModerationService, ContentHashService, GuideSearchService],
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
                    } as GuideHistoryEntryDto)
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
                    .post('/guide')
                    .send({
                        descriptor: new Descriptor({ }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdf',
                            } as GuidePartTextDto
                        ]
                    } as GuideHistoryEntryDto)
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
                    .post('/guide')
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
                    } as GuideHistoryEntryDto)
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
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Dorado],
                    }),
                }, regularUser)
                const guide = await Guide.findOne()
                await request(ctx.app.getHttpServer())
                    .post('/guide')
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
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        teammateHeroes: [HeroId.Mei],
                    }),
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
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        teammateHeroes: [HeroId.Ashe],
                    }),
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
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
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Psychology],
                    }),
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
                    } as GuideHistoryEntryDto)
                    .expect(HttpStatus.FORBIDDEN)
                expect((await Guide.findAll()).length).toBe(0)
            });
            it('deactivating non-existent guide does nothing', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Hanamura],
                    }),
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                    }),
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
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
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
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
                await ctx.app.get(GuideHistoryEntryService).save({
                    parts: [
                        {
                            kind: 'text',
                            contentMd: 'asdf'
                        } as GuidePartTextDto
                    ],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana],
                    }),
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
            it('searches for guides that have given tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                await ctx.app.get(GuideHistoryEntryService).save({
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
                }, user)
                await ctx.app.get(GuideHistoryEntryService).save({
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
                }, user)
                await ctx.app.get(GuideHistoryEntryService).save({
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
                }, user)
                await request(ctx.app.getHttpServer())
                    .get('/guide/search?mapTags=' + MapId.Havana)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(3)
                    })
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search?teammateHeroes=${HeroId.Zarya},${HeroId.Zenyatta}&playerHeroes=${HeroId.Dva}`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                    })
                await request(ctx.app.getHttpServer())
                    .get('/guide/search')
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(3)
                    })
            })
            it('doesn\'t find deactivated guides', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const entry = await ctx.app.get(GuideHistoryEntryService).save({
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
                }, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search?mapTags=${MapId.Havana}`)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                    });
                (await entry.$get('guide')).deactivate(user)
                await request(ctx.app.getHttpServer())
                    .get('/guide/search')
                    .send({
                        mapTags: [MapId.Havana]
                    } as GuideSearchQuery)
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
                const entry = await service.save({
                    parts: [{kind: 'text', contentMd: 'not head'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Havana],
                    }),
                }, user) as GuideHistoryEntry
                const guide = await entry.$get('guide');
                await service.save({
                    parts: [{kind: 'text', contentMd: 'HEAD'}],
                    guideId: guide.id,
                    descriptor: new Descriptor({
                        mapTags: [MapId.Havana],
                    }),
                }, user)
                await service.save({
                    parts: [{kind: 'text', contentMd: 'HEAD'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                    }),
                }, user)
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(2)
                        expect(
                            response.body.guides.map((guide: GuideHistoryEntryDto) => (guide.parts[0] as GuidePartTextDto).contentMd)
                                .filter(it => it === 'HEAD')
                        ).toHaveLength(2)
                    })
            })
            it('can search by thematic tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const correctEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'not head'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Communication],
                    }),
                }, user) as GuideHistoryEntry
                const wrongEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Aim],
                    }),
                }, user) as GuideHistoryEntry
                const anotherEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                }, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search?thematicTags=${GuideTheme.Communication}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideId
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('can search by map tags', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        thematicTags: [GuideTheme.Aim],
                    }),
                }, user) as GuideHistoryEntry
                const correctEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        mapTags: [MapId.Busan],
                    }),
                }, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search?mapTags=${MapId.Busan}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideId
                        ).toBe(correctEntry.guideId)
                    })
            })
            it('searches guides by heroes with and condition', async () => {
                await ctx.fixtures(singleUserFixture, heroesFixture, mapsFixture, thematicTagsFixture)
                const user = await User.findOne();
                const token = ctx.app.get(TokenService).getToken(user)
                const service = ctx.app.get(GuideHistoryEntryService);
                const wrongEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana, HeroId.Baptiste],
                    }),
                }, user) as GuideHistoryEntry
                const correctEntry = await service.save({
                    parts: [{kind: 'text', contentMd: 'hellou'}],
                    descriptor: new Descriptor({
                        playerHeroes: [HeroId.Ana, HeroId.Reinhardt],
                    }),
                }, user) as GuideHistoryEntry
                await request(ctx.app.getHttpServer())
                    .get(`/guide/search?playerHeroes=${HeroId.Ana},${HeroId.Reinhardt}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.guides.length).toBe(1)
                        expect(
                            response.body.guides[0].guideId
                        ).toBe(correctEntry.guideId)
                    })
            })

            afterAll(() => {
                ctx.app.close()
            })
        }
    )
)
