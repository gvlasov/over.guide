import {Controller, Get, Query, Req, Res,} from '@nestjs/common';
import {BattlenetService} from "src/services/battlenet.service";
import {User} from "src/database/models/User";
import {Request, Response} from 'express'
import {FRONTEND_ROOT_URL} from "src/constants";


@Controller('battlenet-auth')
export class BattlenetAuthController {

    constructor(private readonly battlenet: BattlenetService) {

    }


    @Get()
    async logIn(
        @Query('code') code: string,
        @Res() response: Response,
        @Req() request: Request
    ) {
        const user = await this.battlenet.obtainToken(code)
            .then(token => this.battlenet.userInfo(token))
            .then((userInfo: { id, battletag }) => {
                return User.findOne({where: {battleNetUserId: userInfo.id}})
                    .then(async (user): Promise<User> => {
                        if (user === null) {
                            return User.create({
                                battleNetUserId: userInfo.id,
                                name: userInfo.battletag
                            });
                        } else {
                            return user
                        }
                    })
            });
        response.setHeader(
            'Set-Cookie',
            'auth-token=' + user.name + '; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Path=/'
        )
        response.redirect(FRONTEND_ROOT_URL)
    }

}
