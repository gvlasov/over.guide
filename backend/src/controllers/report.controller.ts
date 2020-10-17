import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
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
import ReportQueryDto from "data/dto/ReportQueryDto";
import {ReportSearchService} from "src/services/report-search.service";
import {ModeratorGuard} from "src/services/moderator.guard";
import {RestrictionService} from "src/services/restriction.service";
import RestrictionTypeId from "data/RestrictionTypeId";
import ApiErrorId from "data/ApiErrorId";
import {User} from "src/database/models/User";

@Controller('report')
export class ReportController {

    constructor(
        private readonly authService: AuthService,
        private readonly guideHistoryEntryService: GuideHistoryEntryService,
        private readonly rightsService: RightsService,
        private readonly reportSearchService: ReportSearchService,
        private readonly restrictionService: RestrictionService
    ) {
    }

    @Post('search')
    @UseGuards(ModeratorGuard)
    async search(
        @Res() response: Response,
        @Body() dto: ReportQueryDto,
    ) {
        response.status(HttpStatus.OK)
        response.send(
            await this.reportSearchService.search(dto)
        )
    }

    @Get()
    async test() {
        return Report.scope(['defaultScope', 'withContent']).findAll(
            {
                subQuery: false,
                include: [
                    {
                        model: User,
                        as: 'reporter',
                    }
                ],
                where: {
                    handled: 0,
                },
                limit: 11,
                order: [['createdAt', 'DESC']]
            });
    }

    @Post()
    @UseGuards(AuthenticatedGuard)
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() dto: ReportDto,
    ) {
        this.authService.getUser(request)
            .then(async user => {
                if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId.ReportingBan)) {
                    response.status(HttpStatus.FORBIDDEN)
                    response.send({error: ApiErrorId.UserBannedFromReporting})
                } else {
                    return Report.create({
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
                }
            })
    }

    @Put(':id/handle')
    @UseGuards(ModeratorGuard)
    async handle(
        @Param('id') reportId: number
    ) {
        return Report.update(
            {
                handled: true,
            },
            {
                where: {
                    id: reportId
                },
            }
        )
    }


}
