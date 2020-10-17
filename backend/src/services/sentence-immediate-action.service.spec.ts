import {nestTest} from "src/test/nest-test";
import {SentenceImmediateActionService} from "src/services/sentence-immediate-action.service";
import heroesFixture from "@fixtures/heroes";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import guideDescriptorsFixture from "@fixtures/guide-descriptor";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {Comment} from "src/database/models/Comment";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import HeroId from "data/HeroId";
import {Sentence} from "src/database/models/Sentence";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import abilitiesFixture from "@fixtures/abilities";
import PostTypeId from "data/PostTypeId";
import {Report} from "src/database/models/Report";
import ReportReasonId from "data/ReportReasonId";
import {Op} from "sequelize";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";

describe(
    SentenceImmediateActionService,
    nestTest(SentenceImmediateActionService, [], [ContentHashService, GuideDescriptorService, GuideHistoryEntryService], (ctx) => {
            it('can deactivate a specific guide', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const defendersGuide = await Guide.findOne({
                    where: {
                        authorId: defender.id,
                    }
                })
                const anotherDefendersGuide = await Guide.findOne({
                    where: {
                        authorId: defender.id,
                        id: {
                            [Op.ne]: defendersGuide.id,
                        }
                    }
                })
                await Report.create({
                    postId: defendersGuide.id,
                    postTypeId: PostTypeId.Guide,
                    handled: 0,
                    reporterId: defender.id,
                    reportReasonId: ReportReasonId.OffensiveLanguage,
                })
                await Report.create({
                    postId: anotherDefendersGuide.id,
                    postTypeId: PostTypeId.Guide,
                    handled: 0,
                    reporterId: defender.id,
                    reportReasonId: ReportReasonId.OffensiveLanguage,
                })
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const issuerGHE = await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        parts: [
                            {
                                contentMd: 'asdfasdf',
                                kind: 'text'
                            }
                        ],
                        descriptor: new GuideDescriptorQuickie({
                            teammateHeroes: [HeroId.Zenyatta],
                        }),
                        isPublic: true,
                    },
                    issuer
                )
                    .then(ghe =>
                        Report.create({
                            postId: (ghe as GuideHistoryEntry).guideId,
                            postTypeId: PostTypeId.Guide,
                            handled: 0,
                            reporterId: defender.id,
                            reportReasonId: ReportReasonId.Spam,
                        })
                            .then(() => ghe)
                    )
                expect(defendersGuide.deactivatedAt).toBeNull()
                expect(defendersGuide.deactivatedById).toBeNull()
                expect(anotherDefendersGuide.deactivatedAt).toBeNull()
                expect(anotherDefendersGuide.deactivatedById).toBeNull()
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: defendersGuide.id,
                            typeId: ImmediateActionTypeId.DeactivateGuide,
                        }
                    ]
                )
                await defendersGuide.reload()
                await anotherDefendersGuide.reload()
                await Guide.findOne({
                    where: {
                        id: (issuerGHE as GuideHistoryEntry).guideId,
                    }
                })
                    .then(issuerGuide => {
                        expect(issuerGuide.deactivatedById).toBeNull()
                        expect(issuerGuide.deactivatedAt).toBeNull()
                    })
                expect(defendersGuide.deactivatedById).toStrictEqual(issuer.id)
                expect(defendersGuide.deactivatedAt).not.toBeNull()
                expect(anotherDefendersGuide.deactivatedById).toBeNull()
                expect(anotherDefendersGuide.deactivatedAt).toBeNull()
                await ImmediateAction.findAll()
                    .then(actions => {
                        expect(actions.length).toStrictEqual(1)
                        expect(actions[0].typeId).toStrictEqual(ImmediateActionTypeId.DeactivateGuide)
                        expect(actions[0].sentenceId).toStrictEqual(sentence.id)
                        expect(actions[0].objectId).toStrictEqual(defendersGuide.id)
                    })
            });
            it('can deactivate all guides of a user', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                )
                const entryService = ctx.app.get(GuideHistoryEntryService)
                const defender = await User.create({
                    name: 'defender',
                    battleNetUserId: '1',
                    banned: 0,
                })
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const otherUserWithGuides = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                await Guide.findAll({
                    where: {
                        authorId: defender.id,
                    }
                })
                    .then(guides => {
                        return Promise.all(
                            guides.map(
                                guide => Report.create({
                                    postId: guide.id,
                                    postTypeId: PostTypeId.Guide,
                                    handled: 0,
                                    reporterId: issuer.id,
                                    reportReasonId: ReportReasonId.OffensiveLanguage,
                                })
                            )
                        )
                    })
                const defenderGuideCount = 2
                for (let i = 0; i < 2; i++) {
                    await entryService.create({
                        parts: [
                            {
                                contentMd: 'defender content',
                                kind: 'text',
                            } as GuidePartTextDto
                        ],
                        descriptor: new GuideDescriptorQuickie({
                            playerHeroes: [HeroId.Widowmaker]
                        }),
                        isPublic: true,
                    }, defender)
                        .then(entry => {
                            return Report.create({
                                postId: (entry as GuideHistoryEntry).guideId,
                                postTypeId: PostTypeId.Guide,
                                handled: 0,
                                reporterId: issuer.id,
                                reportReasonId: ReportReasonId.OffensiveLanguage,
                            })
                        })
                }
                const otherUserGuideCount = 3;
                for (let i = 0; i < otherUserGuideCount; i++) {
                    await entryService.create({
                        parts: [
                            {
                                contentMd: 'other user with guides content',
                                kind: 'text',
                            } as GuidePartTextDto
                        ],
                        descriptor: new GuideDescriptorQuickie({
                            playerHeroes: [HeroId.Widowmaker]
                        }),
                        isPublic: true,
                    }, otherUserWithGuides)
                        .then(entry => {
                            return Report.create({
                                postId: (entry as GuideHistoryEntry).guideId,
                                postTypeId: PostTypeId.Guide,
                                handled: 0,
                                reporterId: issuer.id,
                                reportReasonId: ReportReasonId.OffensiveLanguage,
                            })
                        })
                }
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: null,
                            typeId: ImmediateActionTypeId.DeactivateAllGuides,
                        }
                    ]
                )
                const defenderGuides = await Guide.findAll({
                    where: {
                        authorId: defender.id,
                    },
                });
                expect(defenderGuides).toHaveLength(defenderGuideCount)
                expect(
                    defenderGuides.every(guide => guide.deactivatedById === issuer.id && guide.deactivatedAt !== null)
                )
                    .toStrictEqual(true)
                expect(defenderGuides).toHaveLength(defenderGuideCount)
                const otherUserGuides = await Guide.findAll({
                    where: {
                        authorId: otherUserWithGuides.id,
                    },
                });
                expect(otherUserGuides).toHaveLength(otherUserGuideCount)
                expect(
                    otherUserGuides
                        .every(guide => guide.deactivatedById === null && guide.deactivatedAt === null)
                )
                    .toStrictEqual(true)
                await ImmediateAction.findAll()
                    .then(async actions => {
                        expect(actions.length).toStrictEqual(1)
                        expect(actions[0].typeId).toStrictEqual(ImmediateActionTypeId.DeactivateAllGuides)
                        expect(actions[0].sentenceId).toStrictEqual(sentence.id)
                        expect(actions[0].objectId).toBeNull()
                    })
                await Report.findAll({
                    where: {
                        handled: 1,
                    }
                })
                    .then(handledReports => {
                        expect(handledReports).toHaveLength(defenderGuideCount)
                    })
                await Report.findAll({
                    where: {
                        handled: 0,
                    }
                })
                    .then(handledReports => {
                        expect(handledReports).toHaveLength(otherUserGuideCount)
                    })
            });
            it('can delete all guide comments of a user', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const guide = await Guide.findOne()
                const rootComment = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'fuck you',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                await Comment.create({
                    parentId: rootComment.id,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'fuck me',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                    .then(comment =>
                        Report.create({
                            postId: comment.id,
                            postTypeId: PostTypeId.Comment,
                            reporterId: issuer.id,
                            reportReasonId: ReportReasonId.OffensiveLanguage,
                            handled: 0,
                        })
                    )
                const otherUserWithComments = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                const rootComment2 = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'some insight',
                    authorId: otherUserWithComments.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                    .then(comment =>
                        Report.create({
                            postId: comment.id,
                            postTypeId: PostTypeId.Comment,
                            reporterId: issuer.id,
                            reportReasonId: ReportReasonId.OffensiveLanguage,
                            handled: 0,
                        })
                    )
                await Comment.create({
                    parentId: rootComment.id,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'some more insight',
                    authorId: otherUserWithComments.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: null,
                            typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                        }
                    ]
                )
                const defenderComments = await Comment.findAll({
                    where: {
                        authorId: defender.id,
                    },
                });
                expect(defenderComments).toHaveLength(2)
                expect(
                    defenderComments.every(guide => guide.deactivatedById === issuer.id && guide.deactivatedAt !== null)
                )
                    .toStrictEqual(true)
                const otherUserComments = await Comment.findAll({
                    where: {
                        authorId: otherUserWithComments.id,
                    },
                });
                expect(otherUserComments).toHaveLength(2)
                expect(
                    otherUserComments
                        .every(guide => guide.deactivatedById === null && guide.deactivatedAt === null)
                )
                    .toStrictEqual(true)
                await ImmediateAction.findAll()
                    .then(actions => {
                        expect(actions.length).toStrictEqual(1)
                        expect(actions[0].typeId).toStrictEqual(ImmediateActionTypeId.DeleteAllGuideComments)
                        expect(actions[0].sentenceId).toStrictEqual(sentence.id)
                        expect(actions[0].objectId).toBeNull()
                    })
                await Report.findAll({where: {handled: 1}})
                    .then(reports => {
                        expect(reports.length).toStrictEqual(1)
                    })
                await Report.findAll({where: {handled: 0}})
                    .then(reports => {
                        expect(reports.length).toStrictEqual(1)
                    })
            });
            it('can delete a specific comment', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const guide = await Guide.findOne()
                const defenderRootComment = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'fuck you',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deactivatedById: null,
                    deactivatedAt: null,
                })
                const reportOnDefender = await Comment.create({
                    parentId: defenderRootComment.id,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'fuck me',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                    .then(comment =>
                        Report.create({
                            postId: comment.id,
                            postTypeId: PostTypeId.Comment,
                            reporterId: issuer.id,
                            reportReasonId: ReportReasonId.OffensiveLanguage,
                            handled: 0,
                        })
                    )
                const otherUserWithComments = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                const rootComment2 = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'some insight',
                    authorId: otherUserWithComments.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                const reportOnOtherUser = await Comment.create({
                    parentId: defenderRootComment.id,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'some more insight',
                    authorId: otherUserWithComments.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                    .then(comment =>
                        Report.create({
                            postId: comment.id,
                            postTypeId: PostTypeId.Comment,
                            reporterId: issuer.id,
                            reportReasonId: ReportReasonId.OffensiveLanguage,
                            handled: 0,
                        })
                    )
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                expect(defenderRootComment.deactivatedById).toBeNull()
                expect(defenderRootComment.deactivatedAt).toBeNull()
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: defenderRootComment.id,
                            typeId: ImmediateActionTypeId.DeleteComment,
                        }
                    ]
                )
                await defenderRootComment.reload()
                expect(defenderRootComment.deactivatedById).toStrictEqual(issuer.id)
                expect(defenderRootComment.deactivatedAt).not.toBeNull()
                await ImmediateAction.findAll()
                    .then(actions => {
                        expect(actions.length).toStrictEqual(1)
                        expect(actions[0].typeId).toStrictEqual(ImmediateActionTypeId.DeleteComment)
                        expect(actions[0].sentenceId).toStrictEqual(sentence.id)
                        expect(actions[0].objectId).toStrictEqual(defenderRootComment.id)
                    })
                reportOnDefender.reload().then(
                    report => {
                        expect(report.handled).toStrictEqual(1)
                    }
                )
                reportOnOtherUser.reload().then(
                    report => {
                        expect(report.handled).toStrictEqual(0)
                    }
                )
            });
            it('can ignore all current reports of a user', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const guide = await Guide.findOne()
                const commentReportedByDefender = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'useful info',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                const otherUserWithReports = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                const commentReportedByOther = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'some insight',
                    authorId: defender.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                const defenderReport1 = await Report.create({
                    postId: commentReportedByDefender.id,
                    postTypeId: PostTypeId.Comment,
                    reporterId: defender.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 0,
                })
                const defenderReport2 = await Report.create({
                    postId: guide.id,
                    postTypeId: PostTypeId.Guide,
                    reporterId: defender.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 0,
                })
                const defenderReportHandled = await Report.create({
                    postId: (await Guide.findOne({where: {id: {[Op.ne]: guide.id}}})).id,
                    postTypeId: PostTypeId.Guide,
                    reporterId: defender.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 1,
                })
                const otherUserReport = await Report.create({
                    postId: commentReportedByOther.id,
                    postTypeId: PostTypeId.Comment,
                    reporterId: otherUserWithReports.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 0,
                })
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: null,
                            typeId: ImmediateActionTypeId.IgnoreAllCurrentReports,
                        }
                    ]
                )
                const defenderReports = await Report.findAll({
                    where: {
                        reporterId: defender.id,
                    },
                });
                expect(defenderReports).toHaveLength(3)
                expect(
                    defenderReports.every(report => report.handled === 1)
                )
                    .toStrictEqual(true)
                Report.findAll({
                    where: {
                        reporterId: otherUserWithReports.id,
                    },
                })
                    .then(otherUserReports => {
                        expect(otherUserReports).toHaveLength(1)
                        expect(
                            otherUserReports
                                .every(report => report.handled === 0)
                        )
                            .toStrictEqual(true)
                    })
                await ImmediateAction.findAll()
                    .then(actions => {
                        expect(actions.length).toStrictEqual(1)
                        expect(actions[0].typeId).toStrictEqual(ImmediateActionTypeId.IgnoreAllCurrentReports)
                        expect(actions[0].sentenceId).toStrictEqual(sentence.id)
                        expect(actions[0].objectId).toBeNull()
                    })
            });
            it('can make a guide private', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const guide = await Guide.findOne()
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                expect(guide.isPublic).toStrictEqual(1)
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: guide.id,
                            typeId: ImmediateActionTypeId.MakeGuidePrivate,
                        }
                    ]
                )
                await guide.reload()
                expect(guide.isPublic).toStrictEqual(0)
            });
            it('can\'t make non-defender\'s guide private', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    guideDescriptorsFixture,
                    smallGuideTestingFixture,
                )
                const defender = await User.findOne()
                const guide = await Guide.findOne()
                const issuer = await User.create({
                    name: 'issuer',
                    battleNetUserId: '2',
                    banned: 0,
                })
                const otherUserWithGuide = await User.create({
                    name: 'other user',
                    battleNetUserId: '3',
                    banned: 0,
                })
                const otherGuide = await ctx.app.get(GuideHistoryEntryService).create(
                    {
                        isPublic: true,
                        descriptor: new GuideDescriptorQuickie({playerHeroes: [HeroId.Junkrat]}),
                        parts: [
                            {
                                kind: 'text',
                                contentMd: 'djfidjfijdfij'
                            }
                        ]
                    },
                    otherUserWithGuide
                ) as GuideHistoryEntry
                const sentence = await Sentence.create({
                    defenderId: defender.id,
                    judgeId: issuer.id,
                })
                expect((await otherGuide.$get('guide')).isPublic).toStrictEqual(1)
                await ctx.service.issueActions(
                    issuer,
                    sentence,
                    [
                        {
                            objectId: otherGuide.guideId,
                            typeId: ImmediateActionTypeId.MakeGuidePrivate,
                        }
                    ]
                )
                await guide.reload()
                expect((await otherGuide.$get('guide')).isPublic).toStrictEqual(1)
                expect(
                    await ImmediateAction.findAll()
                ).toHaveLength(0)
            });
        }
    )
)
