import { Request } from 'express';
import { TokenService } from "src/services/token.service";
import { User } from "src/database/models/User";
export declare class AuthService {
    private readonly tokenService;
    private user;
    constructor(tokenService: TokenService);
    getUser(request: Request): Promise<User | null>;
}
