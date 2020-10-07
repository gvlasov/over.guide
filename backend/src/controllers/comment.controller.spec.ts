import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {AuthService} from "src/services/auth.service";
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import {CommentController} from "src/controllers/comment.controller";
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
import {Op} from "sequelize";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";


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
                const currentTime = new Date().toISOString();
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: '1a',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: '1b',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: '1c',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide2.id,
                    parentId: null,
                    content: '2a',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                await request(ctx.app.getHttpServer())
                    .get(`/comment/${PostTypeId.Guide}/${guide.id}`)
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
                    .get(`/comment/${PostTypeId.Guide}/${guide2.id}`)
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
                        postId: guide.id,
                        postType: PostTypeId.Guide,
                        content: commentText,
                    } as CommentCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.CREATED)
                    .then(response =>
                        Comment.findAll({
                            where: {
                                postId: guide.id,
                                postType: PostTypeId.Guide,
                                parentId: null,
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
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: oldCommentText,
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime
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
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: oldCommentText,
                    authorId: otherUser.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
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
            it('unauthorized users can\'t create comments', async () => {
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
                    .post(`/comment/create`)
                    .send({
                        postId: guide.id,
                        postType: PostTypeId.Guide,
                        content: 'asdf',
                    } as CommentCreateDto)
                    .expect(HttpStatus.FORBIDDEN)
            });
        }
    )
)
