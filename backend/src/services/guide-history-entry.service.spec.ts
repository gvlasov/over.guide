import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes.json"
import singleUserFixture from "@fixtures/single-user.json"
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import GuidePartName from "data/dto/GuidePartName";
import GuidePartTextDto from "data/dto/GuidePartText";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import HeroIds from "data/HeroIds";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartText} from "src/database/models/GuidePartText";
import GuidePartVideoDto from "src/data/dto/GuidePartVideo";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";

describe(
    GuideHistoryEntryService,
    nestTest(GuideHistoryEntryService, [], [GuideDescriptorService], (ctx) => {
            it('saves first history entry in existing guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    creatorId: user.id
                })
                const entry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [HeroIds.Zenyatta],
                            allyHeroes: [],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ]
                    },
                    user
                )
                expect(entry.guideId).toBe(guide.id)
                expect((await entry.$get('guidePartTexts')).length).toBe(1)
                expect((await entry.$get('guidePartVideos')).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('maps'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('thematicTags'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('players'))).length).toBe(1)
                expect((await entry.$get('descriptor').then(d => d.$get('allies'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('enemies'))).length).toBe(0)
            });
            it('initializes non-existent guide with first history entry', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                expect(await Guide.findOne()).toBe(null)
                const entry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ]
                    },
                    user
                )
                expect(await Guide.findOne()).not.toBe(null)
                expect(entry.guideId).toBe(1)
                expect((await entry.$get('guidePartTexts')).length).toBe(1)
                expect((await entry.$get('guidePartVideos')).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('maps'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('thematicTags'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('players'))).length).toBe(0)
                expect((await entry.$get('descriptor').then(d => d.$get('allies'))).length).toBe(1)
                expect((await entry.$get('descriptor').then(d => d.$get('enemies'))).length).toBe(0)
            });
            it('creates more history entries in a guide', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    singleUserFixture
                )
                const user = await User.findOne()
                const guide = await Guide.create({
                    creatorId: user.id
                })
                const descriptor = await GuideDescriptor.create({})
                const entry = await GuideHistoryEntry.create({
                    guideId: guide.id,
                    updaterId: user.id,
                    descriptorId: descriptor.id,
                })
                expect(
                    (await guide.$get('historyEntries')).length
                ).toBe(1)
                const newEntry = await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ]
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
                    battleNetUserId: '79023670347'
                })
                const guide = await Guide.create({
                    creatorId: user.id
                })
                const descriptor = await GuideDescriptor.create({})
                const entry = await GuideHistoryEntry.create({
                    guideId: guide.id,
                    updaterId: user.id,
                    descriptorId: descriptor.id,
                })
                expect(
                    (await guide.$get('historyEntries')).length
                ).toBe(1)
                const newEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'asdfasdf'
                            } as GuidePartTextDto
                        ]
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
                    creatorId: user.id
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'mouse'
                            } as GuidePartTextDto,
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'house'
                            } as GuidePartTextDto,
                        ]
                    },
                    user
                )
                expect(
                    (await GuidePartText.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(1)
                const secondEntry = await ctx.service.save(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'house'
                            } as GuidePartTextDto,
                            {
                                kind: GuidePartName.Text,
                                contentMd: 'mouse'
                            } as GuidePartTextDto,
                        ]
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
                    creatorId: user.id
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ]
                    },
                    user
                )
                expect(
                    (await GuidePartVideo.findAndCountAll()).count
                ).toBe(2)
                expect(
                    (await GuideHistoryEntry.findAndCountAll()).count
                ).toBe(1)
                const secondEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                        ]
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
                    creatorId: user.id
                })
                const firstEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: guide.id,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 10.0,
                                    endSeconds: 20.0
                                }
                            } as GuidePartVideoDto,
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ]
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
                const secondEntry = <GuideHistoryEntry>await ctx.service.save(
                    {
                        guideId: firstEntry.guideId,
                        descriptor: {
                            playerHeroes: [],
                            allyHeroes: [HeroIds.WreckingBall],
                            enemyHeroes: [],
                            thematicTags: [],
                            mapTags: []
                        },
                        parts: [
                            {
                                kind: GuidePartName.Video,
                                excerpt: {
                                    youtubeVideoId: 'asdf',
                                    startSeconds: 20.0,
                                    endSeconds: 30.0
                                }
                            } as GuidePartVideoDto,
                        ]
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
        }
    )
)
