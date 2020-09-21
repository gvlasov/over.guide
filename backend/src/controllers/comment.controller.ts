import {
    Body,
    Controller,
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
import {CommentVote} from "src/database/models/CommentVote";
import CommentVoteDto from "data/dto/CommentVoteDto";
import {QueryTypes} from "sequelize";

@Controller('comment')
export class CommentController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
    ) {
    }

    @Get(':parentType/:parentId')
    async getComments(
        @Param('parentType') parentType: number,
        @Param('parentId') parentId: number
    ) {

        return this.sequelize.query(
                `
                    select Comment.id,
                           Comment.parentType,
                           Comment.parentId,
                           Comment.content,
                           Comment.createdAt,
                           Comment.updatedAt,
                           count(CV.id) as votes
                    from Comment
                             left join CommentVote CV on Comment.id = CV.commentId
                             left join User U on Comment.authorId = U.id
                    where Comment.parentId = :parentId
                      and Comment.parentType = :parentType
                      and Comment.deactivatedAt is null
                    group by Comment.id
            `,
            {
                replacements: {
                    parentId: parentId,
                    parentType: parentType,
                },
                type: QueryTypes.SELECT,
            }
        )
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
            .then(comment => {
                response.status(HttpStatus.CREATED)
                response.send()
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

    @Post('upvote')
    @UseGuards(AuthenticatedGuard)
    async upvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentVoteDto,
    ) {
        const user = await this.authService.getUser(request)
        CommentVote.create({
            ...dto,
            createdAt: new Date().toISOString(),
            upvoterId: user.id,
        })
            .then(comment => {
                response.status(HttpStatus.CREATED)
                response.send()
            })
    }

    @Post('remove-upvote')
    @UseGuards(AuthenticatedGuard)
    async removeUpvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: CommentVoteDto,
    ) {
        const user = await this.authService.getUser(request)
        CommentVote.destroy({
            where: {
                ...dto,
                upvoterId: user.id,
            },
        })
            .then(result => {
                response.status(HttpStatus.ACCEPTED)
                response.send()
            })
    }

}
