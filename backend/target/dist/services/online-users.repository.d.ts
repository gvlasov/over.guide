import { Socket } from "socket.io";
import { TokenService } from "src/services/token.service";
import { User } from "src/database/models/User";
export declare class OnlineUsersRepository {
    private readonly tokenService;
    private token2Client;
    private clientId2Token;
    private userId2Token;
    constructor(tokenService: TokenService);
    saveClient(token: string, client: Socket): void;
    removeClient(client: Socket): void;
    getUser(client: Socket): Promise<User>;
    getClient(user: User): Socket;
}
