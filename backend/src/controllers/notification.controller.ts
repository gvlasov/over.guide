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

@Controller('notifications')
export class NotificationController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
    ) {
    }

    @UseGuards(AuthenticatedGuard)
    @Post('mark-read')
    @HttpCode(HttpStatus.OK)
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
