import { BattlenetService } from "src/services/battlenet.service";
import { Request, Response } from 'express';
import { TokenService } from "src/services/token.service";
export declare class BattlenetAuthController {
    private readonly battlenet;
    private readonly tokenService;
    constructor(battlenet: BattlenetService, tokenService: TokenService);
    logIn(code: string, response: Response, request: Request): Promise<void>;
}
