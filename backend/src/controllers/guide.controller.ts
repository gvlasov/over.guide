import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntry";
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {
    GuideHistoryEntryService,
    SaveResult
} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {ModerationService} from "src/services/moderation.service";

@Controller('guide')
export class GuideController {

    constructor(
        private readonly authService: AuthService,
        private readonly guideHistoryEntryService: GuideHistoryEntryService,
        private readonly moderationService: ModerationService
    ) {

    }

    @Post()
    @UseGuards(AuthenticatedGuard)
    async save(
        @Res() response: Response,
        @Req() request: Request,
        @Body() guideHistoryEntryDto: GuideHistoryEntryDto,
    ) {
        const user = await this.authService.getUser(request)
        const updating = typeof guideHistoryEntryDto.guideId !== 'undefined';
        if (
            updating
            && (
                await Guide.findOne(
                    {where: {id: guideHistoryEntryDto.guideId}}
                )
            ).creatorId !== user.id
            && !this.moderationService.isModerator(user)
        ) {
            response.status(HttpStatus.FORBIDDEN)
            response.send()
        } else {
            const entry = await this.guideHistoryEntryService.save(guideHistoryEntryDto, user)
            if (entry === SaveResult.SavingDuplicateRejected) {
                response.status(HttpStatus.ACCEPTED)
                response.send()
            } else {
                if (updating) {
                    response.status(HttpStatus.OK)
                    response.send()
                } else {
                    response.status(HttpStatus.CREATED)
                    response.send({
                        guideId: entry.guideId
                    })
                }
            }
        }
    }

    @Post('deactivate')
    @UseGuards(AuthenticatedGuard)
    async deactivate(
        @Res() response: Response,
        @Req() request: Request,
        @Body() target: { id: number },
    ) {
        const user = await this.authService.getUser(request)
        const guide = await Guide.findOne(
            {where: {id: target.id}}
        );
        if (guide === null) {
            response.status(HttpStatus.NOT_FOUND)
        } else if (
            guide.creatorId !== user.id
            && !this.moderationService.isModerator(user)
        ) {
            response.status(HttpStatus.FORBIDDEN)
        } else {
            if (!guide.isActive()) {
                response.status(HttpStatus.METHOD_NOT_ALLOWED)
            } else {
                await guide.deactivate(user)
                response.status(HttpStatus.NO_CONTENT)
            }
        }
        response.send()
    }

    @Post('activate')
    @UseGuards(AuthenticatedGuard)
    async activate(
        @Res() response: Response,
        @Req() request: Request,
        @Body() target: { id: number },
    ) {
        const user = await this.authService.getUser(request)
        const guide = await Guide.findOne(
            {where: {id: target.id}}
        );
        if (guide === null) {
            response.status(HttpStatus.NOT_FOUND)
        } else if (
            guide.creatorId !== user.id
            && !this.moderationService.isModerator(user)
        ) {
            response.status(HttpStatus.FORBIDDEN)
        } else {
            if (guide.isActive()) {
                response.status(HttpStatus.METHOD_NOT_ALLOWED)
            } else {
                await guide.activate(user)
                response.status(HttpStatus.NO_CONTENT)
            }
        }
        response.send()
    }

}
