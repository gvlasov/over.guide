import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {AuthService} from "src/services/auth.service";
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import PostTypeId from "data/PostTypeId";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {ReportController} from "src/controllers/report.controller";
import ReportDto from "data/dto/ReportDto";
import ReportReasonId from "data/ReportReasonId";
import {Guide} from "src/database/models/Guide";
import {Report} from "src/database/models/Report";
import {RightsService} from "src/services/rights.service";
import {Comment} from "src/database/models/Comment";


describe(
    ReportController,
    nestTest(
        ReportController,
        [],
        [TokenService, AuthService, GuideHistoryEntryService, ContentHashService, GuideDescriptorService, RightsService],
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
        }
    )
)
