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
import {Comment} from 'src/database/models/Comment'
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {Vote} from "src/database/models/Vote";
import VoteDto from "data/dto/VoteDto";
import {VoteController} from "src/controllers/vote.controller";
import {GuideHead} from "src/database/models/GuideHead";


describe(
    VoteController,
    nestTest(
        VoteController,
        [],
        [TokenService, AuthService, GuideHistoryEntryService, ContentHashService, GuideDescriptorService],
        (ctx) => {
            it('upvotes and downvotes comment', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne();
                const otherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'hello',
                    authorId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .put(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                await request(ctx.app.getHttpServer())
                    .delete(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
            });
            it('upvotes and downvotes guide', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const head = await GuideHead.findOne({
                    include: [{all: true}]
                })
                const user = await User.findOne();
                const otherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await request(ctx.app.getHttpServer())
                    .put(`/vote`)
                    .send({
                        postId: head.guideHistoryEntry.guideId,
                        postTypeId: PostTypeId.Guide,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => head.reload())
                    .then(head => {
                        expect(head.votesCount).toStrictEqual(1)
                    })
                await request(ctx.app.getHttpServer())
                    .delete(`/vote`)
                    .send({
                        postId: head.guideHistoryEntry.guideId,
                        postTypeId: PostTypeId.Guide,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(response => head.reload())
                    .then(head => {
                        expect(head.votesCount).toStrictEqual(0)
                    })
            });
            it('returns unprocessable entity if comment is already upvoted', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne();
                const otherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'hello',
                    authorId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .put(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                await request(ctx.app.getHttpServer())
                    .put(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            });
            it('returns unprocessable entity when removing non-existent upvote', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne();
                const otherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'hello',
                    authorId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .delete(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            });
            it('can\'t remove other user\'s upvote', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne();
                const otherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '32145235',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'hello',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await Vote.create({
                    postId: comment.id,
                    postTypeId: PostTypeId.Comment,
                    upvoterId: otherUser.id,
                })
                Vote.findAndCountAll()
                    .then(rows => expect(rows.count).toBe(1))
                await request(ctx.app.getHttpServer())
                    .delete(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
                    .then(response => {
                        Vote.findAndCountAll()
                            .then(rows => expect(rows.count).toBe(1))
                    })
            });
            it('unauthorized users can\'t upvote comments', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const guide = await Guide.findOne()
                const user = await User.findOne();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'hello',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .put(`/vote`)
                    .send({
                        postId: comment.id,
                        postTypeId: PostTypeId.Comment,
                    } as VoteDto)
                    .expect(HttpStatus.FORBIDDEN)
            });
        }
    )
)
