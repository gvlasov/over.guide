import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import ReportDto from "data/dto/ReportDto";
import {Report} from "src/database/models/Report";
import {RightsService} from "src/services/rights.service";

@Controller('report')
export class ReportController {

    constructor(
        private readonly authService: AuthService,
        private readonly guideHistoryEntryService: GuideHistoryEntryService,
        private readonly rightsService: RightsService
    ) {
    }

    @Post()
    @UseGuards(AuthenticatedGuard)
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() dto: ReportDto,
    ) {
        this.authService.getUser(request)
            .then(user => {
                if (this.rightsService.canReport(user)) {
                    Report.create({
                        ...dto,
                        reporterId: user.id,
                        handled: 0,
                    })
                        .then(report => {
                            response.status(HttpStatus.OK)
                            response.send()
                        })
                        .catch(e => {
                            if (e.errors[0].type === 'unique violation') {
                                response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                                response.send()
                            } else {
                                throw e
                            }
                        })
                } else {
                    response.status(HttpStatus.OK)
                    response.send()
                }
            })
    }


}
