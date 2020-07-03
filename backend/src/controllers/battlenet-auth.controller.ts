import {Controller, Get, HttpService, Query} from '@nestjs/common';
import {BATTLE_NET_CLIENT_ID, BATTLE_NET_CLIENT_SECRET} from '../constants'

const querystring = require('querystring')

@Controller('battlenet-auth')
export class BattlenetAuthController {

    constructor(private readonly httpService: HttpService) {

    }


    @Get()
    obtainToken(@Query('code') code: string) {
        const authorization = 'Basic ' +
            Buffer.from(
                BATTLE_NET_CLIENT_ID + ':' + BATTLE_NET_CLIENT_SECRET,
                'binary'
            )
                .toString('base64');
        return this.httpService.post(
            'https://eu.battle.net/oauth/token',
            querystring.stringify({
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': 'http://localhost:8080/battlenet-auth',
                'client_id': BATTLE_NET_CLIENT_ID,
                'client_secret': BATTLE_NET_CLIENT_SECRET,
            }),
            {
                headers: {
                    'Authorization': authorization
                },
            }
        )
            .toPromise()
            .catch(reason => {
                console.log(reason)
            })
            .then(response => {
                console.log(response)
            })
    }

}
