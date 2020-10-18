import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import heroesFixture from "@fixtures/heroes";
import {HttpStatus} from "@nestjs/common";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import {ModerationService} from "src/services/moderation.service";
import {SentenceController} from "src/controllers/sentence.controller";
import SentenceCreateDto from "data/dto/SentenceCreateDto";
import {Sentence} from "src/database/models/Sentence";
import RestrictionCreateDto from "data/dto/RestrictionCreateDto";
import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";
import RestrictionTypeId from "data/RestrictionTypeId";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import {Comment} from "src/database/models/Comment";
import PostTypeId from "data/PostTypeId";
import {Guide} from "src/database/models/Guide";

describe(
    SentenceController,
    nestTest(
        SentenceController,
        (ctx) => {
            it('creates a sentence', async () => {
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
                        (user: User) => user.name === 'moderator'
                    )
                const defender = await User.findOne()
                const judge = await User.create({
                    name: 'moderator',
                    battleNetUserId: '1231241241243',
                    banned: 0,
                })
                const currentTime = new Date().toISOString()
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: (await Guide.findOne()).id,
                    parentId: null,
                    content: '1a',
                    authorId: defender.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(judge)
                let restrictionEndTime: string | Date = new Date()
                restrictionEndTime.setDate(restrictionEndTime.getDate() + 30)
                restrictionEndTime = restrictionEndTime.toISOString()
                expect(
                    (await Sentence.findAll()).length
                )
                    .toStrictEqual(0)
                const judgeCommentary = 'i deleted your comments because youre naughty';
                await request(ctx.app.getHttpServer())
                    .put(`/sentence`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary,
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(
                            (await Sentence.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        const sentence = await Sentence.findOne({
                            include: [{all: true}]
                        })
                        expect(sentence.judgeCommentary).toStrictEqual(judgeCommentary)
                        expect(sentence.restrictions).toHaveLength(1)
                        expect(sentence.immediateActions).toHaveLength(1)
                    })
            });
            it('edits a sentence', async () => {
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
                        (user: User) => user.name === 'moderator'
                    )
                const guide = await Guide.findOne()
                const defender = await guide.$get('author')
                const judge = await User.create({
                    name: 'moderator',
                    battleNetUserId: '1231241241243',
                    banned: 0,
                })
                const currentTime = new Date().toISOString()
                await Comment.create({
                    postType: PostTypeId.Guide,
                    postId: (await Guide.findOne()).id,
                    parentId: null,
                    content: '1a',
                    authorId: defender.id,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(judge)
                let restrictionEndTime: string | Date = new Date()
                restrictionEndTime.setDate(restrictionEndTime.getDate() + 30)
                restrictionEndTime = restrictionEndTime.toISOString()
                expect(
                    (await Sentence.findAll()).length
                )
                    .toStrictEqual(0)
                const judgeCommentary = 'i deleted your comments because youre naughty';
                await request(ctx.app.getHttpServer())
                    .put(`/sentence`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary,
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(
                            (await Sentence.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        expect(
                            (await ImmediateAction.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        const sentence = await Sentence.findOne({
                            include: [{all: true}]
                        })
                        expect(sentence.judgeCommentary).toStrictEqual(judgeCommentary)
                        expect(sentence.restrictions).toHaveLength(1)
                        expect(sentence.immediateActions).toHaveLength(1)
                    })
                const sentence = await Sentence.findOne()
                await request(ctx.app.getHttpServer())
                    .put(`/sentence/edit/${sentence.id}`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                            {
                                typeId: RestrictionTypeId.GuideCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                            } as ImmediateActionCreateDto,
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeactivateAllGuides,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary: judgeCommentary + '_updated',
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        const sentence = await Sentence.findOne({
                            include: [{all: true}]
                        })
                        expect(sentence.judgeCommentary).toStrictEqual(judgeCommentary + '_updated')
                        expect(sentence.restrictions).toHaveLength(2)
                        expect(sentence.immediateActions).toHaveLength(2)
                    })
            });
            it('doesn\'t edit a non-existent sentence', async () => {
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
                        (user: User) => user.name === 'moderator'
                    )
                const defender = await User.findOne()
                const judge = await User.create({
                    name: 'moderator',
                    battleNetUserId: '1231241241243',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(judge)
                const currentTime = new Date().toISOString()
                let restrictionEndTime: string | Date = new Date()
                restrictionEndTime.setDate(restrictionEndTime.getDate() + 30)
                restrictionEndTime = restrictionEndTime.toISOString()
                expect(
                    (await Sentence.findAll()).length
                )
                    .toStrictEqual(0)
                const judgeCommentary = 'i deleted your comments because youre naughty';
                await request(ctx.app.getHttpServer())
                    .put(`/sentence`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary,
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.OK)
                    .then(async response => {
                        expect(
                            (await Sentence.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        expect(
                            (await ImmediateAction.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        const sentence = await Sentence.findOne({
                            include: [{all: true}]
                        })
                        expect(sentence.judgeCommentary).toStrictEqual(judgeCommentary)
                        expect(sentence.restrictions).toHaveLength(1)
                        expect(sentence.immediateActions).toHaveLength(1)
                    })
                const sentence = await Sentence.findOne()
                await request(ctx.app.getHttpServer())
                    .put(`/sentence/edit/${sentence.id + 1}`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                            {
                                typeId: RestrictionTypeId.GuideCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeactivateAllGuides,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary: judgeCommentary + '_updated',
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NOT_FOUND)
                    .then(async response => {
                        expect(
                            (await ImmediateAction.findAndCountAll()).count
                        )
                            .toStrictEqual(1)
                        const sentence = await Sentence.findOne({
                            include: [{all: true}]
                        })
                        expect(sentence.judgeCommentary).toStrictEqual(judgeCommentary)
                        expect(sentence.restrictions).toHaveLength(1)
                        expect(sentence.immediateActions).toHaveLength(1)
                    })
            });
            it('non-moderator can\'t create or edit sentences', async () => {
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
                        (user: User) => user.name === 'moderator'
                    )
                const defender = await User.findOne()
                const nonModerator = await User.create({
                    name: 'just a dude',
                    battleNetUserId: '84894894',
                    banned: 0,
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(nonModerator)
                const currentTime = new Date().toISOString()
                let restrictionEndTime: string | Date = new Date()
                restrictionEndTime.setDate(restrictionEndTime.getDate() + 30)
                restrictionEndTime = restrictionEndTime.toISOString()
                expect(
                    (await Sentence.findAll()).length
                )
                    .toStrictEqual(0)
                const judgeCommentary = 'i deleted your comments because youre naughty';
                await request(ctx.app.getHttpServer())
                    .put(`/sentence`)
                    .send({
                        defenderId: defender.id,
                        restrictions: [
                            {
                                typeId: RestrictionTypeId.CommentCreationBan,
                                objectId: null,
                                start: currentTime,
                                end: restrictionEndTime,
                            } as RestrictionCreateDto,
                        ],
                        immediateActions: [
                            {
                                objectId: null,
                                typeId: ImmediateActionTypeId.DeleteAllGuideComments,
                            } as ImmediateActionCreateDto,
                        ],
                        judgeCommentary,
                    } as SentenceCreateDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.FORBIDDEN)
                    .then(async response => {
                        expect(
                            (await Sentence.findAndCountAll()).count
                        )
                            .toStrictEqual(0)
                    })
            });
        }
    )
)
