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
import {QueryTypes} from "sequelize";
import {CommentReadDto} from "data/dto/CommentReadDto";
import {User} from "src/database/models/User";
import PostTypeId from "data/PostTypeId";

@Controller('comment')
export class CommentController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
    ) {
    }

    @Get(':postType/:postId')
    async getComments(
        @Param('postType') postType: number,
        @Param('postId') postId: number
    ): Promise<CommentReadDto[]> {
        return this.sequelize.query<any>(
            `
                    select Comment.id,
                           Comment.postType,
                           Comment.postId,
                           Comment.parentId,
                           Comment.content,
                           Comment.createdAt,
                           Comment.updatedAt,
                           (Comment.deactivatedById is not null or Comment.deactivatedAt is not null) as deleted,
                           U.id         as authorId,
                           U.name       as authorName,
                           count(V.id) as votes
                    from Comment
                             left join Vote V on Comment.id = V.postId and V.postTypeId = ${PostTypeId.Comment}
                             left join User U on Comment.authorId = U.id
                    where Comment.postId = :postId
                      and Comment.postType = :postType
                    group by Comment.id
            `,
            {
                replacements: {
                    postId: postId,
                    postType: postType,
                },
                type: QueryTypes.SELECT,
            }
        )
            .then(comments => {
                return comments.map(comment => {
                    comment.author = {}
                    comment.author.id = comment.authorId
                    comment.author.name = comment.authorName
                    if (comment.deleted) {
                        delete comment.content
                    }
                    delete comment.authorId
                    delete comment.authorName
                    return comment
                })
            })
    }

    @Post('create')
    @UseGuards(AuthenticatedGuard)
    async commentOnGuide(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentCreateDto,
    ) {
        const user = await this.authService.getUser(request)
        if (dto.parentId !== null) {
            await Comment.findOne(
                {
                    where: {
                        id: dto.parentId,
                        deactivatedById: null,
                        deactivatedAt: null,
                    }
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
            .then(comment => comment.reload(
                {
                    include: [
                        {
                            model: User,
                            as: 'author'
                        }
                    ]
                }
            ))
            .then(comment => {
                response.status(HttpStatus.CREATED)
                response.send(comment.toDto(0))
            })
    }

    @Post('edit')
    @UseGuards(AuthenticatedGuard)
    async editCommentOnGuide(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentUpdateDto,
    ) {
        const user = await this.authService.getUser(request)
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
