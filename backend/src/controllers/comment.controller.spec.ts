import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {AuthService} from "src/services/auth.service";
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import {CommentController} from "src/controllers/comment.controller";
import EntityTypeId from "data/EntityTypeId";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import {Comment} from 'src/database/models/Comment'
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {Op} from "sequelize";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import CommentVoteDto from "data/dto/CommentVoteDto";
import {CommentVote} from "src/database/models/CommentVote";


describe(
    CommentController,
    nestTest(
        CommentController,
        [],
        [TokenService, AuthService, GuideHistoryEntryService, ContentHashService, GuideDescriptorService],
        (ctx) => {
            it('gets list of comments', async () => {
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
                const guide2 = await Guide.findOne({
                    where: {
                        id: {
                            [Op.not]: guide.id,
                        },
                    },
                })
                await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: '1a',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: '1b',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: '1c',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide2.id,
                    content: '2a',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .get(`/comment/${EntityTypeId.Guide}/${guide.id}`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.length
                        ).toBe(3)
                        expect(
                            response.body[0].votes
                        ).toBe(0)
                    })
                await request(ctx.app.getHttpServer())
                    .get(`/comment/${EntityTypeId.Guide}/${guide2.id}`)
                    .send()
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.length
                        ).toBe(1)
                    })
            });
            it('creates comment', async () => {
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
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const commentText = 'hello this is comment';
                await request(ctx.app.getHttpServer())
                    .post(`/comment/create`)
                    .send({
                        parentId: guide.id,
                        parentType: EntityTypeId.Guide,
                        content: commentText,
                    } as CommentCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                    .then(response =>
                        Comment.findAll({
                            where: {
                                parentId: guide.id,
                                parentType: EntityTypeId.Guide,
                                content: commentText,
                            }
                        })
                    )
                    .then(comments => {
                        expect(comments).toHaveLength(1)
                    })
            });
            it('edits comment', async () => {
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
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const oldCommentText = 'hello';
                const comment = await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: oldCommentText,
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                const newCommentText = oldCommentText + '_updated';
                await request(ctx.app.getHttpServer())
                    .post(`/comment/edit`)
                    .send({
                        id: comment.id,
                        content: newCommentText,
                    } as CommentUpdateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.ACCEPTED)
                    .then(
                        response =>
                            Comment.findOne({
                                where: {
                                    id: comment.id
                                }
                            })
                    )
                    .then(comment => {
                        expect(comment.content).toBe(newCommentText)
                    })
            });
            it('can\'t edit other user comment', async () => {
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
                const oldCommentText = 'hello';
                const comment = await Comment.create({
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: oldCommentText,
                    authorId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                const newCommentText = oldCommentText + '_updated';
                await request(ctx.app.getHttpServer())
                    .post(`/comment/edit`)
                    .send({
                        id: comment.id,
                        content: newCommentText,
                    } as CommentUpdateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
                    .then(
                        response =>
                            Comment.findOne({
                                where: {
                                    id: comment.id
                                }
                            })
                    )
                    .then(comment => {
                        expect(comment.content).toBe(oldCommentText)
                    })
            });
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
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: 'hello',
                    authorId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                await request(ctx.app.getHttpServer())
                    .post(`/comment/upvote`)
                    .send({
                        commentId: comment.id,
                    } as CommentVoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                await request(ctx.app.getHttpServer())
                    .post(`/comment/remove-upvote`)
                    .send({
                        commentId: comment.id,
                    } as CommentVoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.ACCEPTED)
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
                    parentType: EntityTypeId.Guide,
                    parentId: guide.id,
                    content: 'hello',
                    authorId: user.id,
                    createdAt: new Date().toISOString(),
                })
                await CommentVote.create({
                    commentId: comment.id,
                    upvoterId: otherUser.id,
                    createdAt: new Date().toISOString(),
                })
                CommentVote.findAndCountAll()
                    .then(rows => expect(rows.count).toBe(1))
                await request(ctx.app.getHttpServer())
                    .post(`/comment/remove-upvote`)
                    .send({
                        commentId: comment.id,
                    } as CommentVoteDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.ACCEPTED)
                    .then(response => {
                        CommentVote.findAndCountAll()
                            .then(rows => expect(rows.count).toBe(1))
                    })
            });
        }
    )
)
