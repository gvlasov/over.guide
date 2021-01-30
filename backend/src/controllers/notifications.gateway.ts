import {
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {TokenService} from "src/services/token.service";
import {OnlineUsersRepository} from "src/services/online-users.repository";
import {Notification} from "src/database/models/Notification";
import {Op} from "sequelize";
import NotificationsPageDto from "data/dto/NotificationsPageDto";
import {Inject} from "@nestjs/common";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly tokenService: TokenService,
        private readonly onlineUsersRepository: OnlineUsersRepository,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
) {
    }

    @SubscribeMessage('auth')
    async auth(client: Socket, token: string): Promise<boolean> {
        return this.tokenService.getUser(token)
            .then(user => {
                if (user === null) {
                    return false
                } else {
                    this.onlineUsersRepository.saveClient(token, client)
                    return true
                }

            })
    }

    @SubscribeMessage('show-more')
    async showMore(client: Socket, clientAlreadyHasIds: number[]): Promise<NotificationsPageDto> {
        const user = await this.onlineUsersRepository.getUser(client)
        const countPerPage = 10
        return Notification.findAll({
            where: {
                userId: user.id,
                id: {
                    [Op.notIn]: clientAlreadyHasIds,
                },
            },
            limit: countPerPage + 1,
            order: [['read', 'ASC'], ['id', 'DESC']],
        })
            .then(
                async notifications => {
                    return {
                        items: notifications.slice(0, countPerPage).map(n => n.toDto()),
                        hasNextPage: notifications.length === countPerPage + 1,
                        totalUnread: await this.sequelize.query(
                            `
select count(*) as cnt from Notification
where userId = ${user.id}
and \`read\` = 0
`
                        )
                            .then(
                                (result: [unknown[], unknown]) => {
                                    return ((result[0][0] as any).cnt as number)
                                }
                            )
                    }
                }
            )
    }

    handleDisconnect(client: Socket): any {
        this.onlineUsersRepository.removeClient(client)
    }
}