import {Controller, Get, Query, Req, Res,} from '@nestjs/common';
import {BattlenetService} from "src/services/battlenet.service";
import {User} from "src/database/models/User";
import {CookieOptions, Request, Response} from 'express'
import {TokenService} from "src/services/token.service";


@Controller('battlenet-auth')
export class BattlenetAuthController {

    constructor(
        private readonly battlenet: BattlenetService,
        private readonly tokenService: TokenService
    ) {

    }


    @Get()
    async logIn(
        @Query('code') code: string,
        @Res() response: Response,
        @Req() request: Request
    ) {
        this.battlenet.obtainToken(code)
            .then(token => this.battlenet.userInfo(token))
            .then((userInfo: { id, battletag }) => {
                if (typeof userInfo.battletag === "undefined") {
                    throw new Error(`Empty battletag on account ${JSON.stringify(userInfo)}`)
                }
                return User.findOne({where: {battleNetUserId: userInfo.id}})
                    .then(async (user): Promise<User> => {
                        if (user === null) {
                            return User.create({
                                battleNetUserId: userInfo.id,
                                name: userInfo.battletag,
                                banned: 0,
                            });
                        } else {
                            return user
                        }
                    })
            })
            .then((user) => {
                const cookieOptions = {
                    expires: new Date('Tue, 19 Jan 2038 03:14:07 GMT'),
                    path: '/',
                    domain: process.env.COOKIE_DOMAIN,
                } as CookieOptions;
                response.cookie(
                    'auth-token',
                    this.tokenService.getToken(user),
                    cookieOptions
                )
                response.cookie(
                    'username',
                    user.name,
                    cookieOptions
                )
                response.cookie(
                    'userId',
                    user.id,
                    cookieOptions
                )
                response.redirect(process.env.FRONTEND_ROOT_URL)
            })
    }

}
