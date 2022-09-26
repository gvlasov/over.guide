import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenService } from "src/services/token.service";
export declare class AuthMiddleware implements NestMiddleware {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    use(req: Request, res: Response, next: Function): Promise<void>;
}
