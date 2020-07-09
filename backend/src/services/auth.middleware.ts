import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {TokenService} from "src/services/token.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) {
    }

    async use(req: Request, res: Response, next: Function) {
        const authHeader = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substr('Bearer '.length)
            const user = await this.tokenService.getUser(token)
            if (user !== null) {
                user.battleNetUserId
            }
        }
        next();
    }

}
