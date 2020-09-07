import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    ValidationPipe
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
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import {
    GuideSearchQuery,
    GuideSearchService
} from "src/services/guide-search.service";
import EmptyDescriptorException from "src/services/EmptyDescriptorException";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {User} from "src/database/models/User";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";

@Controller('guide')
export class GuideController {

    constructor(
        private readonly authService: AuthService,
        private readonly guideHistoryEntryService: GuideHistoryEntryService,
        private readonly moderationService: ModerationService,
        private readonly guideSearchService: GuideSearchService
    ) {

    }

    @Get(':id')
    async get(
        @Res() response: Response,
        @Param('id') id: number
    ) {
        Guide.findOne({
            where: {
                id: id,
                deactivatedById: null,
            },
            include: [
                {
                    model: GuideHistoryEntry,
                    as: 'heads',
                    include: [
                        {
                            all: true,
                        },
                        {
                            model: Guide,
                            as: 'guide',
                            include: [
                                {
                                    model: User,
                                    as: 'creator'
                                }
                            ]
                        },
                        {
                            model: GuideDescriptor,
                            as: 'descriptor',
                            include: [
                                {
                                    all: true,
                                }
                            ],
                        }
                    ],
                }
            ]
        })
            .then(guide => guide.head)
            .then(head => {
                response.status(HttpStatus.OK)
                response.send(head.toDto())
            })
            .catch(e => {
                response.status(HttpStatus.NOT_FOUND)
                response.send()
            })
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
            try {
                const entry = await this.guideHistoryEntryService.save(guideHistoryEntryDto, user)
                if (entry === SaveResult.SavingDuplicateRejected) {
                    response.status(HttpStatus.ACCEPTED)
                    response.send()
                } else if (updating) {
                    response.status(HttpStatus.OK)
                    response.send()
                } else {
                    response.status(HttpStatus.CREATED)
                    response.send({
                        guideId: entry.guideId
                    })
                }
            } catch (e) {
                if (e instanceof EmptyDescriptorException) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send()
                } else {
                    throw e;
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

    @Get('search')
    async search(
        @Query(new ValidationPipe({transform: true})) query: GuideSearchQuery
    ): Promise<GuideSearchPageDto> {
        return this.guideSearchService.search(query)
    }

    @Post('search')
    async searchPost(
        @Body() query: GuideSearchQuery
    ): Promise<GuideSearchPageDto> {
        return this.guideSearchService.search(query)
    }

}
