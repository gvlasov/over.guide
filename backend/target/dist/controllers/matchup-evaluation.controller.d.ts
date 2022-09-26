import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import { Request, Response } from "express";
import { AuthService } from "src/services/auth.service";
export declare class MatchupEvaluationController {
    private readonly authService;
    constructor(authService: AuthService);
    createEvaluation(response: Response, request: Request, dtos: MatchupEvaluationDto[]): Promise<void>;
    removeEvaluations(response: Response, request: Request, oppositions: [number, number][]): Promise<void>;
    myEvaluations(request: Request): Promise<MatchupEvaluationDto[]>;
}
