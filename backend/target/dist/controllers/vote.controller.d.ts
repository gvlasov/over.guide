import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import VoteDto from "data/dto/VoteDto";
export declare class VoteController {
    private readonly authService;
    upvote(response: Response, request: Request, dto: VoteDto): Promise<void>;
    constructor(authService: AuthService);
    removeUpvote(response: Response, request: Request, dto: VoteDto): Promise<void>;
}
