import {Controller, Get, Query} from '@nestjs/common';
import {BattlenetService} from "src/services/battlenet.service";


@Controller('battlenet-auth')
export class BattlenetAuthController {

    constructor(private readonly battlenet: BattlenetService) {

    }


    @Get()
    async logIn(@Query('code') code: string) {
        return Promise.resolve(
            this.battlenet.obtainToken(code)
                .then(token => {
                    return this.battlenet.userInfo(token)
                })
        )
    }

}
