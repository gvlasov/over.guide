import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
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
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import {GuideHead} from "src/database/models/GuideHead";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import ApiErrorId from "data/ApiErrorId";
import {RestrictionService} from "src/services/restriction.service";
import RestrictionTypeId from "data/RestrictionTypeId";
import GuideSearchByAuthorQuery from "data/dto/GuideSearchByAuthorQuery";
import SearchCacheService from "src/services/search-cache.service";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";

@Controller('guide')
export class GuideController {


    constructor(
        private readonly authService: AuthService,
        private readonly guideHistoryEntryService: GuideHistoryEntryService,
        private readonly moderationService: ModerationService,
        private readonly guideSearchService: GuideSearchService,
        private readonly restrictionService: RestrictionService,
        private readonly guideSearchCache: SearchCacheService
    ) {

    }

    @Get(':id')
    async get(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        this.authService.getUser(request)
            .then(user => {
                return GuideHead.findOne({
                    where: {
                        guideId: id,
                    },
                    include: GuideHead.includesForDto()
                })
                    .then(head => {
                        if (head === null) {
                            response.status(HttpStatus.NOT_FOUND)
                            response.send()
                        } else if (
                            !head.guideHistoryEntry.guide.isPublic
                            && (
                                user === null
                                || user.id !== head.guideHistoryEntry.guide.authorId
                                && !this.moderationService.isModerator(user)
                            )
                        ) {
                            response.status(HttpStatus.FORBIDDEN)
                            response.send()
                        } else {
                            response.status(HttpStatus.OK)
                            response.send(head.toDto())
                        }
                    })
            })
    }

    @Post('create')
    @UseGuards(AuthenticatedGuard)
    async create(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: GuideHistoryEntryCreateDto,
    ) {
        const user = await this.authService.getUser(request)
        try {
            const entry = await this.guideHistoryEntryService.create(dto, user)
            if (entry === SaveResult.SavingDuplicateRejected) {
                response.status(HttpStatus.ACCEPTED)
                response.send()
            } else if (entry === SaveResult.UserBannedFromGuideCreation) {
                response.status(HttpStatus.FORBIDDEN)
                response.send({error: ApiErrorId.UserBannedFromEditingGuides})
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

    @Post('update')
    @UseGuards(AuthenticatedGuard)
    async update(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: GuideHistoryEntryAppendDto,
    ) {
        const user = await this.authService.getUser(request)
        if (
            dto.isPublic === true
            && await this.restrictionService.hasActiveRestriction(
            user,
            RestrictionTypeId.ForceGuidePrivate,
            dto.guideId
            )
        ) {
            response.status(HttpStatus.FORBIDDEN)
            response.send({error: ApiErrorId.GuideForcedToBePrivate})
        } else if (
            (
                await Guide.findOne(
                    {where: {id: dto.guideId}}
                )
            ).authorId !== user.id
            && !this.moderationService.isModerator(user)
        ) {
            response.status(HttpStatus.FORBIDDEN)
            response.send()
        } else {
            try {
                const entry = await this.guideHistoryEntryService.append(dto, user)
                if (entry === SaveResult.SavingDuplicateRejected) {
                    response.status(HttpStatus.ACCEPTED)
                    response.send()
                } else {
                    response.status(HttpStatus.OK)
                    response.send()
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
            {
                where: {id: target.id},
                include: [{
                    association: 'head',
                    include: [{
                        association: 'guideHistoryEntry',
                        include: [{
                            association: 'descriptor',
                            include: [{all: true}]
                        }]
                    }],
                }]
            }
        );
        if (guide === null) {
            response.status(HttpStatus.NOT_FOUND)
        } else if (
            guide.authorId !== user.id
            && !this.moderationService.isModerator(user)
        ) {
            response.status(HttpStatus.FORBIDDEN)
        } else {
            if (!guide.isActive()) {
                response.status(HttpStatus.METHOD_NOT_ALLOWED)
            } else {
                await guide.deactivate(user)
                    .then(guide => {
                        this.guideSearchCache.clear(
                            guide.head.guideHistoryEntry.descriptor.toDto()
                        )
                    })
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
            guide.authorId !== user.id
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

    @Post('search')
    @HttpCode(HttpStatus.OK)
    async searchPost(
        @Body() query: GuideSearchQuery
    ): Promise<GuideSearchPageDto> {
        return this.guideSearchCache.getOrSet(
            query,
            () => this.guideSearchService.search(query)
        )
    }

    @Get('search-by-video/:videoId')
    async searchByVideo(
        @Param('videoId') videoId: string
    ): Promise<ExistingGuideHeadDto[]> {
        return GuideHead.findAll({
            include: GuideHead.includesForDto({
                excerpt: {
                    where: {
                        youtubeVideoId: videoId,
                    },
                    required: true,
                },
                guidePartVideos: {
                    required: true,
                },
            })
        })
            .then(guides => guides.map(g => g.toDto()))
    }

    @Post('search-by-author')
    async searchByAuthor(
        @Body() query: GuideSearchByAuthorQuery,
        @Res() response: Response
    ) {
        this.guideSearchService.searchByAuthor(query)
            .then(page => {
                response.status(HttpStatus.OK)
                response.send(page)
            })
    }

}
