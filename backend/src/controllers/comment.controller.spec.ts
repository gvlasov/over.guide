import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
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
import {Op} from "sequelize";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import RestrictionTypeId from "data/RestrictionTypeId";
import ApiErrorId from "data/ApiErrorId";


describe(
    CommentController,
    nestTest(
        CommentController,
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
                            response.body[0].votesCount
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
                        parentId: null,
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
                    banned: 0,
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
            it('can\'t edit deleted comments', async () => {
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
                    banned: 0,
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
                    deactivatedById: user.id,
                    deactivatedAt: new Date().toISOString(),
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
                    .then(response => Comment.findOne({where: {id: comment.id}}))
                    .then(comment => {
                        expect(comment.content).toBe(oldCommentText)
                    })
            });
            it('can\'t edit comments that are more than 30 minutes old', async () => {
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
                const date = new Date();
                date.setHours(date.getHours() - 1)
                const hourAgo = date.toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: oldCommentText,
                    authorId: user.id,
                    createdAt: hourAgo,
                    updatedAt: hourAgo,
                    deactivatedById: null,
                    deactivatedAt: null,
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
                    .then(response => Comment.findOne({where: {id: comment.id}}))
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
            it('user can delete his comments', async () => {
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
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'asdf',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                expect(
                    (await Comment.findAndCountAll()).count
                ).toStrictEqual(1)
                await request(ctx.app.getHttpServer())
                    .delete(`/comment/${comment.id}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async () => {
                        expect(
                            (await Comment.findAndCountAll()).count
                        ).toStrictEqual(1)
                        return Comment.findOne({where: {id: comment.id}})
                            .then(comment => {
                                expect(comment.deactivatedById).toStrictEqual(user.id)
                                expect(comment.deactivatedAt).not.toBeNull()
                            })
                    })
            });
            it('user can\'t delete other users\' comments', async () => {
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
                const anotherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '1234213452',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'asdf',
                    authorId: anotherUser.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                await request(ctx.app.getHttpServer())
                    .delete(`/comment/${comment.id}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.UNPROCESSABLE_ENTITY)
                    .then(() => Comment.findOne({where: {id: comment.id}}))
                    .then(comment => {
                        expect(comment.deactivatedAt).toBeNull()
                        expect(comment.deactivatedById).toBeNull()
                    })
            });
            it('deleted comment and its tree are accessible with no content in deleted comment', async () => {
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
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const currentTime = new Date().toISOString();
                const rootComment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'root',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                    deactivatedById: user.id,
                    deactivatedAt: new Date().toISOString(),
                })
                const childComment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: rootComment.id,
                    content: 'child',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                expect(
                    (await Comment.findAll()).length
                ).toStrictEqual(2)
                await request(ctx.app.getHttpServer())
                    .get(`/comment/${PostTypeId.Guide}/${guide.id}`)
                    .send()
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async (response) => {
                        expect(response.body[0].deleted).toStrictEqual(true)
                        expect(response.body[0].content).toStrictEqual(void 0)
                    })
            });
            it('can\'t reply to deleted comments', async () => {
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
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                const currentTime = new Date().toISOString();
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: 'root',
                    authorId: user.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                    deactivatedById: user.id,
                    deactivatedAt: new Date().toISOString(),
                })
                expect(
                    (await Comment.findAndCountAll()).count
                ).toStrictEqual(1)
                await request(ctx.app.getHttpServer())
                    .post(`/comment/create`)
                    .send({
                        postId: comment.postId,
                        postType: comment.postType,
                        parentId: comment.id,
                        content: 'reply',
                    } as CommentCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NOT_FOUND)
                    .then(async (response) => {
                        expect(
                            (await Comment.findAndCountAll()).count
                        ).toStrictEqual(1)
                    })
            });
            it('user banned from commenting can\'t create or edit comments', async () => {
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
                    battleNetUserId: '43343',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(defender)
                const currentTime = new Date().toISOString();
                const momentIn2Hours = new Date()
                momentIn2Hours.setHours(momentIn2Hours.getHours() + 2)
                await Sentence.create({
                    defenderId: defender.id,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                        return Restriction.create({
                            typeId: RestrictionTypeId.CommentCreationBan,
                            sentenceId: sentence.id,
                            objectId: null,
                            start: new Date('2020-09-15T20:30:40.535Z'),
                            end: momentIn2Hours.toISOString(),
                        })
                    })
                const oldCommentText = 'root';
                const comment = await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: guide.id,
                    parentId: null,
                    content: oldCommentText,
                    authorId: judge.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                expect((await Comment.findAll())).toHaveLength(1)
                await request(ctx.app.getHttpServer())
                    .post(`/comment/create`)
                    .send({
                        postId: guide.id,
                        postType: PostTypeId.Guide,
                        parentId: null,
                        content: 'reply',
                    } as CommentCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.FORBIDDEN)
                    .then(async (response) => {
                        expect(
                            response.body.error
                        ).toStrictEqual(ApiErrorId.UserBannedFromCommenting)
                        expect((await Comment.findAll())).toHaveLength(1)
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/comment/edit`)
                    .send({
                        id: comment.id,
                        content: 'reply+88888888888888888',
                    } as CommentUpdateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.FORBIDDEN)
                    .then(async (response) => {
                        expect(
                            response.body.error
                        ).toStrictEqual(ApiErrorId.UserBannedFromCommenting)
                        expect((await Comment.findOne()).content).toStrictEqual(oldCommentText)
                    })
            });
        }
    )
)
