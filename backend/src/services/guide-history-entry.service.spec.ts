import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import mapsFixture from "@fixtures/maps"
import thematicTagsFixture from "@fixtures/thematicTags"
import singleUserFixture from "@fixtures/single-user"
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
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
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

describe(
    GuideHistoryEntryService,
    nestTest(GuideHistoryEntryService, [], [GuideDescriptorService, ContentHashService], (ctx) => {
            it('saves first history entry in existing guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryCreateDto,
                    user
                )
                expect(await Guide.findOne()).not.toBe(null)
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
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                    battleNetUserId: '79023670347'
                })
                const guide = await Guide.create({
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                    authorId: user.id
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
                        ]
                    } as GuideHistoryEntryAppendDto,
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
        }
    )
)
