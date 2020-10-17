import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import mapsFixture from "@fixtures/maps"
import thematicTagsFixture from "@fixtures/thematicTags"
import singleUserFixture from "@fixtures/single-user"
import {
    GuideHistoryEntryService,
    SaveResult
} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import HeroId from "data/HeroId";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartText} from "src/database/models/GuidePartText";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {ContentHashService} from "src/services/content-hash.service";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import Descriptor from "data/dto/GuideDescriptorQuickie";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import RestrictionTypeId from "data/RestrictionTypeId";
import {RestrictionService} from "src/services/restriction.service";

describe(
    GuideHistoryEntryService,
    nestTest(GuideHistoryEntryService, [], [GuideDescriptorService, ContentHashService, RestrictionService], (ctx) => {
            it('saves first history entry in existing guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const entry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Zenyatta],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(entry.guideId).toBe(guide.id)
                expect((await entry.$get('guidePartTexts')).length).toBe(1)
                expect((await entry.$get('guidePartVideos')).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('maps'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('thematicTags'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('players'))).length).toBe(1)
                expect((await entry.$get('descriptor').then(d => d.$get('teammates'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('enemies'))).length).toBe(0)
            });
            it('links descriptors with their given parts', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            playerHeroes: [HeroId.Zenyatta, HeroId.Soldier],
                            teammateHeroes: [HeroId.Dva],
                            enemyHeroes: [HeroId.Winston],
                            thematicTags: [GuideTheme.Communication],
                            mapTags: [MapId.Hanamura, MapId.Nepal, MapId.Numbani],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                const descriptor = (await GuideDescriptor.findOne({
                    include: [
                        {all: true}
                    ]
                }))
                expect(descriptor.players.length).toBe(2)
                expect(descriptor.teammates.length).toBe(1)
                expect(descriptor.enemies.length).toBe(1)
                expect(descriptor.thematicTags.length).toBe(1)
                expect(descriptor.maps.length).toBe(3)
            });
            it('initializes non-existent guide with first history entry', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                expect(await Guide.findOne()).toBe(null)
                const entry = <GuideHistoryEntry>await ctx.service.create(
                    {
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(await Guide.findOne()).not.toBe(null)
                expect((await Guide.findOne()).isPublic).toBe(1)
                expect(entry.guideId).toBe(1)
                expect((await entry.$get('guidePartTexts')).length).toBe(1)
                expect((await entry.$get('guidePartVideos')).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('maps'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('thematicTags'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('players'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('teammates'))).length).toBe(1)
                expect((await entry.$get('descriptor').then(d => d.$get('enemies'))).length).toBe(0)
            });
            it('creates more history entries in a guide', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const descriptorService = ctx.app.get(GuideDescriptorService)
                const entry = await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor:
                            new Descriptor({
                                teammateHeroes: [HeroId.WreckingBall],
                                playerHeroes: [HeroId.Baptiste],
                            }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await guide.$get('historyEntries')).length
                ).toBe(1)
                const newEntry = await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                guide.reload()
                expect(
                    (await guide.$get('historyEntries')).length
                ).toBe(2)
            });
            it('can save guide history entry by another user', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const anotherUser = await User.create({
                    name: 'Another dude',
                    battleNetUserId: '79023670347',
                    banned: 0,
                })
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdfeed'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await guide.$get('historyEntries')).length
                ).toBe(1)
                const newEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ],
                        isPublic: true,
                    },
                    anotherUser
                )
                expect(
                    newEntry.updaterId
                ).toBe(anotherUser.id)
            });
            it('reuses existing GuidePartTexts if they are merely reordered', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'mouse'
                            } as GuidePartTextDto,
                            {
                                kind: 'text',
                                contentMd: 'house'
                            } as GuidePartTextDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await GuidePartText.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(1)
                const secondEntry = await ctx.service.append(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'house'
                            } as GuidePartTextDto,
                            {
                                kind: 'text',
                                contentMd: 'mouse'
                            } as GuidePartTextDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    secondEntry
                ).toBeInstanceOf(GuideHistoryEntry)
                expect(
                    (await GuidePartText.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(2)
            });
            it('reuses existing GuidePartVideos if they are merely reordered', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await GuidePartVideo.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(1)
                const secondEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(secondEntry)
                    .toBeInstanceOf(GuideHistoryEntry)
                expect(
                    (await GuidePartVideo.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(2)
            });
            it('reuses existing guide parts even if some of them are being removed', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id,
                    isPublic: true,
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: guide.id,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await GuidePartVideo.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(1)
                expect(
                    (await firstEntry.$get('guidePartVideos')).length
                ).toBe(2)
                const secondEntry = <GuideHistoryEntry>await ctx.service.append(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ],
                        isPublic: true,
                    },
                    user
                )
                expect(
                    (await GuidePartVideo.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await secondEntry.$get('guidePartVideos')).length
                ).toBe(1)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(2)
            });
            it('can create non-public guide', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const firstEntry = <GuideHistoryEntry>await ctx.service.create(
                    {
                        descriptor: new Descriptor({
                            teammateHeroes: [HeroId.WreckingBall],
                        }),
                        parts: [
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ],
                        isPublic: false,
                    },
                    user
                )
                await Guide.findOne({where: {id: firstEntry.guideId}})
                    .then(guide => {
                        expect(guide.isPublic).toBe(0)
                    })
            });
            it('can\'t create or edit guides if user is banned', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                const defender = await User.findOne();
                const judge = await User.create({
                    name: 'judge',
                    battleNetUserId: '123',
                    banned: 0,
                })
                const momentIn2Hours = new Date();
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.GuideCreationBan,
                            objectId: null,
                            sentenceId: sentence.id,
                            start: new Date().toISOString(),
                            end: momentIn2Hours.toISOString(),
                        })
                    })
                expect(
                    await ctx.service.create(
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
                        defender
                    )
                ).toStrictEqual(
                    SaveResult.UserBannedFromGuideCreation
                )
            });
        }
    )
)
