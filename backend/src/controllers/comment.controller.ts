import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {Comment} from "src/database/models/Comment";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import {Op} from "sequelize";
import {CommentReadDto} from "data/dto/CommentReadDto";
import {RestrictionService} from "src/services/restriction.service";
import RestrictionTypeId from "data/RestrictionTypeId";
import ApiErrorId from "data/ApiErrorId";

@Controller('comment')
export class CommentController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
        private readonly restrictionService: RestrictionService
    ) {
    }

    @Get(':postType/:postId')
    async getComments(
        @Param('postType') postType: number,
        @Param('postId') postId: number
    ): Promise<CommentReadDto[]> {
        return Comment.scope(['defaultScope', 'votes']).findAll({
            where: {
                postType: postType,
                postId: postId,
            }
        })
            .then(comments => {
                return comments.map(comment => comment.toDto())
            })
    }

    @Post('create')
    @UseGuards(AuthenticatedGuard)
    async createComment(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentCreateDto,
    ) {
        const user = await this.authService.getUser(request)
        if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId.CommentCreationBan)) {
            response.status(HttpStatus.FORBIDDEN)
            response.send({error: ApiErrorId.UserBannedFromCommenting})
        } else {
            if (dto.parentId !== null) {
                await Comment.findOne(
                    {
                        where: {
                            deactivatedById: {
                                [Op.eq]: null,
                            },
                            deactivatedAt: {
                                [Op.eq]: null,
                            },
                            id: dto.parentId,
                        },
                    }
                )
                    .then(comment => {
                        if (comment === null) {
                            response.status(HttpStatus.NOT_FOUND)
                            response.send()
                        }
                    })
            }
            Comment.create(
                {
                    ...dto,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    authorId: user.id,
                },
            )
                .then(comment => Comment.findOne({where: {id: comment.id}}))
                .then(comment => {
                    response.status(HttpStatus.CREATED)
                    response.send(comment.toDto())
                })
        }
    }

    @Post('edit')
    @UseGuards(AuthenticatedGuard)
    async editCommentOnGuide(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentUpdateDto,
    ) {
        const user = await this.authService.getUser(request)

        if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId.CommentCreationBan)) {
            response.status(HttpStatus.FORBIDDEN)
            response.send({error: ApiErrorId.UserBannedFromCommenting})
        } else {
            const minDate = new Date();
            minDate.setMinutes(minDate.getMinutes() - 30)
            Comment.update(
                {
                    ...dto,
                    updatedAt: new Date().toISOString(),
                },
                {
                    where: {
                        id: dto.id,
                        authorId: user.id,
                        deactivatedById: null,
                        deactivatedAt: null,
                        createdAt: {
                            [Op.gt]: minDate.toISOString()
                        }
                    },
                }
            )
                .then(comment => {
                    if (comment[0] === 0) {
                        response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        response.send()
                    } else {
                        response.status(HttpStatus.ACCEPTED)
                        response.send()
                    }
                })
        }
    }

    @Delete(':id')
    @UseGuards(AuthenticatedGuard)
    async deleteComment(
        @Res() response: Response,
        @Req() request: Request,
        @Param('id') id: number,
    ) {
        this.authService.getUser(request)
            .then(
                user =>
                    Comment.update(
                        {
                            deactivatedById: user.id,
                            deactivatedAt: new Date().toISOString(),
                        },
                        {
                            where: {
                                id: id,
                                authorId: user.id,
                            },
                        }
                    )
            )
            .then(deletedCount => {
                if (deletedCount[0] === 0) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send()
                } else {
                    response.status(HttpStatus.OK)
                    response.send()
                }
            })
    }

}
