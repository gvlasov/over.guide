import {User} from "src/database/models/User";
import {nestTest} from "src/test/nest-test";
import singleUserFixture from "@fixtures/single-user"
import smallGuideTestingFixture from "@fixtures/small-guide-testing"
import {TokenService} from "src/services/token.service";
import request from 'supertest'
import {AuthService} from "src/services/auth.service";
import heroesFixture from "@fixtures/heroes";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import abilitiesFixture from "@fixtures/abilities";
import {HttpStatus} from "@nestjs/common";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {ContentHashService} from "src/services/content-hash.service";
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import {UserController} from "src/controllers/user.controller";
import {GuideSearchService} from "src/services/guide-search.service";
import UsernameChangeDto from "data/dto/UsernameChangeDto";

describe(
    UserController,
    nestTest(
        UserController,
        [],
        [AuthService, TokenService, GuideHistoryEntryService, ContentHashService, GuideDescriptorService, GuideSearchService],
        (ctx) => {
            it('gets user info', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({});
                await request(ctx.app.getHttpServer())
                    .get(`/user/${user.id}`)
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.lastAuthoredGuides.guides
                        ).toHaveLength(0)
                    })
                await Guide.findOne({})
                    .then(guide => {
                        guide.creatorId = user.id
                        return guide.save()
                    })
                await request(ctx.app.getHttpServer())
                    .get(`/user/${user.id}`)
                    .expect(HttpStatus.OK)
                    .then(response => {
                        expect(
                            response.body.lastAuthoredGuides.guides
                        ).toHaveLength(1)
                    })
            });
            it('changes username', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({});
                const anotherUser = await User.create({
                    name: 'another user',
                    battleNetUserId: '1231241241243',
                })
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                expect(user.name).not.toBe('hellokitty')
                await request(ctx.app.getHttpServer())
                    .post(`/user/change-username`)
                    .send({
                        newUsername: 'hellokitty'
                    } as UsernameChangeDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                    .then(response => {
                        return user.reload()
                    })
                    .then(user => {
                        expect(user.name).toBe('hellokitty')
                        expect(anotherUser.name).toBe('another user')
                    })
            });
            it('username change requires login', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({});
                const myOriginalUsername = user.name;
                await request(ctx.app.getHttpServer())
                    .post(`/user/change-username`)
                    .send({
                        newUsername: 'hellokitty',
                    } as UsernameChangeDto)
                    .expect(HttpStatus.FORBIDDEN)
                await user.reload()
                expect(user.name).toBe(myOriginalUsername)
            });
            it('validates username', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    abilitiesFixture,
                    smallGuideTestingFixture
                )
                const user = await User.findOne({});
                const originalUsername = user.name;
                const tokenService = ctx.app.get(TokenService)
                const token = tokenService.getToken(user)
                await request(ctx.app.getHttpServer())
                    .post(`/user/change-username`)
                    .send({
                        newUsername: 'jo'
                    } as UsernameChangeDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.BAD_REQUEST)
                    .then(response => {
                        return user.reload()
                    })
                    .then(user => {
                        expect(user.name).toBe(originalUsername)
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/user/change-username`)
                    .send({
                        newUsername: '1234567890abc'
                    } as UsernameChangeDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.BAD_REQUEST)
                    .then(response => {
                        return user.reload()
                    })
                    .then(user => {
                        expect(user.name).toBe(originalUsername)
                    })
                await request(ctx.app.getHttpServer())
                    .post(`/user/change-username`)
                    .send({
                        newUsername: '1234567890ab'
                    } as UsernameChangeDto)
                    .set({Authorization: `Bearer ${token}`})
                    .expect(HttpStatus.NO_CONTENT)
                    .then(response => {
                        return user.reload()
                    })
                    .then(user => {
                        expect(user.name).toBe('1234567890ab')
                    })
            });
        }
    )
)