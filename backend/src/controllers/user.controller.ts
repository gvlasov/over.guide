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
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import {User} from "src/database/models/User";
import {GuideSearchService} from "src/services/guide-search.service";
import UsernameChangeDto from "data/dto/UsernameChangeDto";
import {ValidationError} from "sequelize";

@Controller('user')
export class UserController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly searchService: GuideSearchService,
        private readonly authService: AuthService,
    ) {

    }

    @Get(':id')
    async get(
        @Param('id') userId,
        @Res() response: Response,
        @Req() request: Request
    ) {
        const requester = await this.authService.getUser(request)
        const scopes = ['defaultScope', 'withVotesCount']
        const isSelf = requester !== null && requester.id === Number.parseInt(userId)
        if (isSelf) {
            scopes.push('activeRestrictions')
        }
        User.scope(scopes).findOne({
            where: {
                id: userId
            },
        })
            .then(async user => {
                if (user === null) {
                    response.status(HttpStatus.NOT_FOUND)
                    response.send()
                } else {
                    response.status(HttpStatus.OK)
                    let privatePart;
                    if (isSelf) {
                        privatePart = {
                            restrictions: user.sentences.flatMap(s => s.restrictions).map(r => r.toDto()),
                        }
                    } else {
                        privatePart = {}
                    }
                    response.send(
                        {
                            user: user.toDto(),
                            lastAuthoredGuides: await this.searchService.searchByAuthor(
                                {
                                    authorId: userId,
                                    clientAlreadyHasGuideIds: [],
                                }
                            ),
                            guideVotesReceivedCount: user.guideVotesReceivedCount,
                            ...privatePart
                        }
                    )
                }
            });
    }

    @UseGuards(AuthenticatedGuard)
    @Post('change-username')
    changeUsername(
        @Req() request,
        @Res() response: Response,
        @Body() usernameChange: UsernameChangeDto,
    ) {
        if (!usernameChange.newUsername) {
            response.status(HttpStatus.BAD_REQUEST)
            response.send()
        }
        this.authService.getUser(request)
            .then(user => {
                if (usernameChange.newUsername.length < 3 || usernameChange.newUsername.length > 12) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send()
                } else {
                    User.update(
                        {
                            name: usernameChange.newUsername,
                        },
                        {
                            where: {
                                id: user.id,
                            },
                        }
                    )
                        .then(result => {
                            response.status(HttpStatus.NO_CONTENT);
                            response.send()
                        })
                        .catch(e => {
                            if (e instanceof ValidationError) {
                                response.status(HttpStatus.UNPROCESSABLE_ENTITY);
                                response.send()
                            } else {
                                throw e;
                            }
                        });
                }
            })
    }
}
