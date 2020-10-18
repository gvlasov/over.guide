import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";
import {TOKEN_CIPHER_SECRET} from "src/constants";

@Injectable()
export class TokenService {

    CryptoJS = require('crypto-js')

    getToken(user: User): string {
        return this.CryptoJS.Rabbit.encrypt(
            user.battleNetUserId.toString(),
            TOKEN_CIPHER_SECRET
        ).toString();
    }

    async getUser(token: string): Promise<User | null> {
        // https://stackoverflow.com/a/22601457/1542343
        const battleNetUserId = this.CryptoJS.Rabbit.decrypt(
            token,
            TOKEN_CIPHER_SECRET
        ).toString(this.CryptoJS.enc.Utf8);
        return await User.findOne({where: {battleNetUserId: battleNetUserId}});
    }


}
