import {Injectable} from '@nestjs/common';
import {Request} from 'express';
import {TokenService} from "src/services/token.service";
import {User} from "src/database/models/User";

@Injectable()
export class AuthService {
    private user: User

    constructor(
        private readonly tokenService: TokenService,
    ) {
    }

    async getUser(request: Request) {
        if (typeof this.user === 'undefined') {
            const authHeader = request.header('Authorization');
            if (
                typeof authHeader !== 'undefined'
                && authHeader.startsWith('Bearer ')
            ) {
                const token = authHeader.substr('Bearer '.length)
                this.user = await this.tokenService.getUser(token)
            }
        }
        return this.user
    }

}
