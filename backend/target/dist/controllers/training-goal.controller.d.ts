import { AuthService } from "src/services/auth.service";
import { Request } from "express";
import { Sequelize } from "sequelize-typescript";
import OrderedGuideHeadDto from "data/dto/OrderedGuideHeadDto";
export declare class TrainingGoalController {
    private readonly sequelize;
    private readonly authService;
    constructor(sequelize: Sequelize, authService: AuthService);
    myTrainingGoals(request: Request): Promise<OrderedGuideHeadDto[]>;
    delete(request: any, response: any, params: any): Promise<void>;
    reorder(request: any, response: any): Promise<void>;
    addAndReorder(request: any, response: any): Promise<void>;
    add(request: any, response: any, params: any): Promise<void>;
}
