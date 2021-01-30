import {Injectable} from '@nestjs/common';
import {Socket} from "socket.io";
import {TokenService} from "src/services/token.service";
import {User} from "src/database/models/User";

@Injectable()
export class OnlineUsersRepository {

    private token2Client: {
        [key: string]: Socket
    } = {}

    private clientId2Token: {
        [key: string]: string
    } = {}

    private userId2Token: {
        [key: string]: string
    } = {}

    constructor(private readonly tokenService: TokenService) {
    }

    saveClient(token: string, client: Socket) {
        this.clientId2Token[client.id] = token
        this.token2Client[token] = client
        const userId = this.tokenService.getBattleNetUserId(token)
        this.userId2Token[userId] = token
        console.log('connect', client.id, 'with token', token)
    }

    removeClient(client: Socket) {
        console.log('disconnect', client.id)
        delete this.token2Client[this.clientId2Token[client.id]]
        delete this.clientId2Token[client.id]
    }

    async getUser(client: Socket): Promise<User> {
        return this.tokenService.getUser(this.clientId2Token[client.id])
            .then(user => {
                if (user === null) {
                    throw new Error(
                        'No user for client ' + client.id
                    );
                }
                return user
            })
    }

    getClient(user: User): Socket {
        const token = this.userId2Token[user.battleNetUserId]
        const client = this.token2Client[token];
        if (client === void 0) {
            throw new Error(
                'No client with token ' + token
            )
        }
        return client
    }

}