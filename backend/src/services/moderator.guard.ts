import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {AuthService} from "src/services/auth.service";
import {Request} from "express";
import {ModerationService} from "src/services/moderation.service";

@Injectable()
export class ModeratorGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly moderationService: ModerationService,
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService
            .getUser(context.switchToHttp().getRequest<Request>())
            .then(user => {
                return user !== null && this.moderationService.isModerator(user)
            })
    }
}