import { User } from "src/database/models/User";
export declare class TokenService {
    CryptoJS: any;
    getToken(user: User): string;
    getUser(token: string): Promise<User | null>;
    getBattleNetUserId(token: string): string;
}
