import { AuthService } from "src/services/auth.service";
import { Request } from "express";
import { Sequelize } from "sequelize-typescript";
export declare class NotificationController {
    private readonly sequelize;
    private readonly authService;
    constructor(sequelize: Sequelize, authService: AuthService);
    markRead(request: Request, notificationIds: number[]): Promise<void>;
    markAllRead(request: Request): Promise<void>;
}
