import {
    Body,
    Controller,
    Delete,
    HttpStatus,
    Put,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {Vote} from "src/database/models/Vote";
import VoteDto from "data/dto/VoteDto";

@Controller('vote')
export class VoteController {

    @Put()
    @UseGuards(AuthenticatedGuard)
    async upvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: VoteDto,
    ) {
        this.authService.getUser(request)
            .then(user =>
                Vote.create({
                    ...dto,
                    upvoterId: user.id,
                })
            )
            .then(vote => {
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

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Delete()
    @UseGuards(AuthenticatedGuard)
    async removeUpvote(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: VoteDto,
    ) {
        this.authService.getUser(request)
            .then(user =>
                Vote.destroy({
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
