import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {
    GuideHistoryEntryService,
    SaveResult
} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {ModerationService} from "src/services/moderation.service";

@Controller('browse-guide')
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

}
