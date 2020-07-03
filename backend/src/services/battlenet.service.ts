import {HttpService, Injectable} from '@nestjs/common';
import {BATTLE_NET_CLIENT_ID, BATTLE_NET_CLIENT_SECRET} from "src/constants";


@Injectable()
export class BattlenetService {
    private querystring;

    constructor(
        private readonly httpService: HttpService
    ) {
        this.querystring = require('querystring')
    }

    async obtainToken(code: string): Promise<string> {
        const authorization = 'Basic ' +
            Buffer.from(
                BATTLE_NET_CLIENT_ID + ':' + BATTLE_NET_CLIENT_SECRET,
                'binary'
            )
                .toString('base64');
        return await this.httpService.post(
            'https://eu.battle.net/oauth/token',
            this.querystring.stringify({
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
            .then(response => {
                return response.data.access_token;
            })
    }

    async userInfo(token: string) {
        const authorization = 'Bearer ' + token;
        return await this.httpService.get(
            'https://eu.battle.net/oauth/userinfo',
            {
                headers: {
                    'Authorization': authorization
                },
            }
        )
            .toPromise()
            .then(response => {
                return response.data;
            })
    }


}
