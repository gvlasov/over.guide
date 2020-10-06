import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
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
import {Comment} from "src/database/models/Comment";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import {CommentVote} from "src/database/models/CommentVote";
import CommentVoteDto from "data/dto/CommentVoteDto";
import {QueryTypes} from "sequelize";
import CommentReadDto from "data/dto/CommentReadDto";
import {User} from "src/database/models/User";

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
                           U.id         as authorId,
                           U.name       as authorName,
                           count(CV.id) as votes
                    from Comment
                             left join CommentVote CV on Comment.id = CV.commentId
                             left join User U on Comment.authorId = U.id
                    where Comment.postId = :postId
                      and Comment.postType = :postType
                      and Comment.deactivatedAt is null
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
        Comment.create({
            ...dto,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            authorId: user.id,
        })
            .then((comment: Comment) =>
                comment.reload({
                    include: [
                        {
                            model: User,
                            as: 'author'
                        }
                    ]
                })
            )
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

    @Put('upvote')
    @UseGuards(AuthenticatedGuard)
    async upvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentVoteDto,
    ) {
        this.authService.getUser(request)
            .then(user =>
                CommentVote.create({
                    ...dto,
                    upvoterId: user.id,
                })
            )
            .then(comment => {
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

    @Delete('upvote')
    @UseGuards(AuthenticatedGuard)
    async removeUpvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentVoteDto,
    ) {
        this.authService.getUser(request)
            .then(user =>
                CommentVote.destroy({
                    where: {
                        ...dto,
                        upvoterId: user.id,
                    },
                })
            )
            .then(count => {
                if (count === 0) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send()
                } else {
                    response.status(HttpStatus.OK)
                    response.send()
                }
            })
    }

}
