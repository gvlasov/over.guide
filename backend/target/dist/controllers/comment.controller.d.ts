import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import { CommentReadDto } from "data/dto/CommentReadDto";
import { RestrictionService } from "src/services/restriction.service";
import { NotificationService } from "src/services/notification.service";
export declare class CommentController {
    private readonly sequelize;
    private readonly authService;
    private readonly restrictionService;
    private readonly notificationService;
    constructor(sequelize: Sequelize, authService: AuthService, restrictionService: RestrictionService, notificationService: NotificationService);
    getComments(postType: number, postId: number): Promise<CommentReadDto[]>;
    createComment(response: Response, request: Request, dto: CommentCreateDto): Promise<void>;
    editCommentOnGuide(response: Response, request: Request, dto: CommentUpdateDto): Promise<void>;
    deleteComment(response: Response, request: Request, id: number): Promise<void>;
}
