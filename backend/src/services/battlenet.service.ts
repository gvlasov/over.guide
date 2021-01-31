import {HttpService, Injectable} from '@nestjs/common';


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
                process.env.BATTLE_NET_CLIENT_ID + ':' + process.env.BATTLE_NET_CLIENT_SECRET,
                'binary'
            )
                .toString('base64');
        return await this.httpService.post(
            'https://eu.battle.net/oauth/token',
            this.querystring.stringify({
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': process.env.BATTLE_NET_REDIRECT_URI,
                'client_id': process.env.BATTLE_NET_CLIENT_ID,
                'client_secret': process.env.BATTLE_NET_CLIENT_SECRET,
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
            .catch(error => {
                console.log(error)
            })
    }

    async userInfo(token: string) {
        return await this.httpService.get(
            'https://eu.battle.net/oauth/userinfo',
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            }
        )
            .toPromise()
            .then(response => {
                return response.data;
            })
    }


}
