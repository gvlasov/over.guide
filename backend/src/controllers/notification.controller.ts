import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";
import {Notification} from 'src/database/models/Notification'
import NotificationPageDto from "data/dto/NotificationsPageDto";
import NotificationsPageQueryDto from "data/dto/NotificationsPageQueryDto";
import {Op} from "sequelize";

@Controller('notifications')
export class NotificationController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
    ) {
    }

    @UseGuards(AuthenticatedGuard)
    @Post('feed')
    @HttpCode(HttpStatus.OK)
    async getFresh(
        @Req() request: Request,
        @Body() query: NotificationsPageQueryDto,
    ): Promise<NotificationPageDto> {
        const user = await this.authService.getUser(request)
        const countPerPage = 10
        return Notification.findAll({
            where: {
                userId: user.id,
                id: {
                    [Op.notIn]: query.clientAlreadyHasIds,
                },
            },
            limit: countPerPage + 1,
            order: [['read', 'ASC'], ['id', 'DESC']],
        })
            .then(
                async notifications => {
                    return {
                        notifications: notifications.slice(0, countPerPage).map(n => n.toDto()),
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

    @UseGuards(AuthenticatedGuard)
    @Post('mark-read')
    async markRead(
        @Req() request: Request,
        @Body() notificationIds: number[],
    ): Promise<void> {
        const user = await this.authService.getUser(request)
        await Notification.update(
            {
                read: true,
            },
            {
                where: {
                    id: notificationIds,
                    userId: user.id,
                    read: false,
                },
            }
        )
    }

    @UseGuards(AuthenticatedGuard)
    @Post('mark-all-read')
    async markAllRead(
        @Req() request: Request,
    ): Promise<void> {
        const user = await this.authService.getUser(request)
        await Notification.update(
            {
                read: true,
            },
            {
                where: {
                    userId: user.id,
                    read: false,
                },
            }
        )
    }

}
