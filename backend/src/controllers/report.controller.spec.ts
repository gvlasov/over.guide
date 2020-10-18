import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import PostTypeId from "data/PostTypeId";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import {ReportController} from "src/controllers/report.controller";
import ReportDto from "data/dto/ReportDto";
import ReportReasonId from "data/ReportReasonId";
import {Guide} from "src/database/models/Guide";
import {Report} from "src/database/models/Report";
import {Comment} from "src/database/models/Comment";
import {ModerationService} from "src/services/moderation.service";
import ReportQueryDto from "data/dto/ReportQueryDto";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import RestrictionTypeId from "data/RestrictionTypeId";
import ApiErrorId from "data/ApiErrorId";


describe(
    ReportController,
    nestTest(
        ReportController,
        (ctx) => {
            it('reports a guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const reporter = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(reporter)
                expect(
                    (await Report.findAndCountAll()).count
                )
                    .toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .post(`/report`)
                    .send({
                        postId: guide.id,
                        postTypeId: PostTypeId.Guide,
                        reportReasonId: ReportReasonId.Spam
                    } as ReportDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(
                            (await Report.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                    })
            });
            it('reports comment', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne()
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: 'fuck you',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                const reporter = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(reporter)
                expect(
                    (await Report.findAndCountAll()).count
                )
                    .toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .post(`/report`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                        reportReasonId: ReportReasonId.Spam
                    } as ReportDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(
                            (await Report.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                    })
            });
            it('unauthorized user can\'t report', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                expect(
                    (await Report.findAndCountAll()).count
                )
                    .toStrictEqual(0)
                await request(ctx.app.getHttpServer())
                    .post(`/report`)
                    .send({
                        postId: guide.id,
                        postTypeId: PostTypeId.Guide,
                        reportReasonId: ReportReasonId.Spam
                    } as ReportDto)
                    .expect(HttpStatus.FORBIDDEN)
                    .then(async response => {
                        expect(
                            (await Report.findAndCountAll()).count
                        )
                            .toStrictEqual(0)
                    })
            });
            it('can find reports with polymorphic content', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const moderationService = ctx.app.get<ModerationService>(ModerationService);
                jest.spyOn(moderationService, 'isModerator')
                    .mockImplementation(
                        (user: User) => true
                    )
                const user = await User.findOne()
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const reporter = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                    banned: 0,
                })
                const guide = await Guide.findOne()
                const currentTime = new Date().toISOString();
                const commentText = 'fuck you';
                const comment = await Comment.create({
                    parentId: null,
                    postId: guide.id,
                    postType: PostTypeId.Guide,
                    content: commentText,
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                const guideReport = await Report.create({
                    postId: guide.id,
                    postTypeId: PostTypeId.Guide,
                    reporterId: reporter.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 0,
                })
                const commentReport = await Report.create({
                    postId: comment.id,
                    postTypeId: PostTypeId.Comment,
                    reporterId: reporter.id,
                    reportReasonId: ReportReasonId.NotEducational,
                    handled: 0,
                })
                await request(ctx.app.getHttpServer())
                    .post(`/report/search`)
                    .send({
                        clientAlreadyHasReportIds: [],
                    } as ReportQueryDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(response.body.reports.length).toStrictEqual(2)
                        expect(
                            response.body.reports[0].post.guideHistoryEntry.guide.id
                        )
                            .toStrictEqual(guide.id)
                        expect(
                            response.body.reports[1].post.content
                        )
                            .toStrictEqual(commentText)
                    })
            });
            it('user banned from reporting can\'t create reports', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const defender = await User.findOne()
                const judge = await User.create({
                    name: 'judge',
                    battleNetUserId: '423434',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(defender)
                expect(
                    (await Report.findAndCountAll()).count
                )
                    .toStrictEqual(0)
                const momentIn2Hours = new Date()
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.ReportingBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: momentIn2Hours.toISOString(),
                        })
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/report`)
                    .send({
                        postId: guide.id,
                        postTypeId: PostTypeId.Guide,
                        reportReasonId: ReportReasonId.Spam
                    } as ReportDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.FORBIDDEN)
                    .then(async response => {
                        expect(
                            response.body.error
                        ).toStrictEqual(ApiErrorId.UserBannedFromReporting)
                        expect(
                            (await Report.findAndCountAll()).count
                        )
                            .toStrictEqual(0)
                    })
            });
        }
    )
)
