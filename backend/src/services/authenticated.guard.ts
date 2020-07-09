import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {AuthService} from "src/services/auth.service";
import {Request} from "express";

@Injectable()
export class AuthenticatedGuard implements CanActivate {

    constructor(private readonly authService: AuthService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.getUser(context.switchToHttp().getRequest<Request>()) !== null
    }
}