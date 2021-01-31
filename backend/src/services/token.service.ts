import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";

@Injectable()
export class TokenService {

    CryptoJS = require('crypto-js')

    getToken(user: User): string {
        return this.CryptoJS.Rabbit.encrypt(
            user.battleNetUserId.toString(),
            process.env.TOKEN_CIPHER_SECRET
        ).toString();
    }

    async getUser(token: string): Promise<User | null> {
        return User.findOne({
            where: {
                battleNetUserId: this.getBattleNetUserId(token)
            },
        })
    }

    getBattleNetUserId(token: string): string {
        // https://stackoverflow.com/a/22601457/1542343
        return this.CryptoJS.Rabbit
            .decrypt(token, process.env.TOKEN_CIPHER_SECRET)
            .toString(this.CryptoJS.enc.Utf8);
    }

}
