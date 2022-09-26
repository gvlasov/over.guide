import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from "src/services/token.service";
import { OnlineUsersRepository } from "src/services/online-users.repository";
import NotificationsPageDto from "data/dto/NotificationsPageDto";
import { Sequelize } from "sequelize-typescript";
export declare class NotificationsGateway implements OnGatewayDisconnect {
    private readonly tokenService;
    private readonly onlineUsersRepository;
    private readonly sequelize;
    server: Server;
    constructor(tokenService: TokenService, onlineUsersRepository: OnlineUsersRepository, sequelize: Sequelize);
    auth(client: Socket, token: string): Promise<boolean>;
    showMore(client: Socket, clientAlreadyHasIds: number[]): Promise<NotificationsPageDto>;
    handleDisconnect(client: Socket): any;
}
