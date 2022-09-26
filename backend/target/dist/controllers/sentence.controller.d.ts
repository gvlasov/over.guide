import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import SentenceCreateDto from "data/dto/SentenceCreateDto";
import { Sequelize } from "sequelize-typescript";
import { SentenceImmediateActionService } from "src/services/sentence-immediate-action.service";
import { OnlineUsersRepository } from "src/services/online-users.repository";
import { NotificationService } from "src/services/notification.service";
export declare class SentenceController {
    private readonly authService;
    private readonly sequelize;
    private readonly actionService;
    private readonly notificationService;
    private readonly onlineUsersRepository;
    constructor(authService: AuthService, sequelize: Sequelize, actionService: SentenceImmediateActionService, notificationService: NotificationService, onlineUsersRepository: OnlineUsersRepository);
    create(request: Request, response: Response, dto: SentenceCreateDto): Promise<void>;
    edit(request: Request, response: Response, sentenceId: number, dto: SentenceCreateDto): Promise<void>;
}
