import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import { GuideSearchService } from "src/services/guide-search.service";
import UsernameChangeDto from "data/dto/UsernameChangeDto";
export declare class UserController {
    private readonly sequelize;
    private readonly searchService;
    private readonly authService;
    constructor(sequelize: Sequelize, searchService: GuideSearchService, authService: AuthService);
    get(userId: any, response: Response, request: Request): Promise<void>;
    changeUsername(request: any, response: Response, usernameChange: UsernameChangeDto): void;
}
