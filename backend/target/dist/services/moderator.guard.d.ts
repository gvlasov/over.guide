import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from "src/services/auth.service";
import { ModerationService } from "src/services/moderation.service";
export declare class ModeratorGuard implements CanActivate {
    private readonly authService;
    private readonly moderationService;
    constructor(authService: AuthService, moderationService: ModerationService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
