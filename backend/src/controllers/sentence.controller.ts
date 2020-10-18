import {
    Body,
    Controller,
    HttpStatus,
    Inject,
    Param,
    Put,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request, Response} from "express";
import {ModeratorGuard} from "src/services/moderator.guard";
import SentenceCreateDto from "data/dto/SentenceCreateDto";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";
import {Sentence} from "src/database/models/Sentence";
import {Restriction} from "src/database/models/Restriction";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import {SentenceImmediateActionService} from "src/services/sentence-immediate-action.service";

@Controller('sentence')
export class SentenceController {

    constructor(
        private readonly authService: AuthService,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly actionService: SentenceImmediateActionService
    ) {
    }

    @Put()
    @UseGuards(ModeratorGuard)
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() dto: SentenceCreateDto,
    ) {
        this.authService.getUser(request)
            .then(judge => {
                return this.sequelize.transaction(() => {
                    return Sentence.create({
                        ...dto,
                        judgeId: judge.id,
                    })
                        .then(sentence => {
                            return Restriction.bulkCreate(dto.restrictions.map(restrictionDto => {
                                return {
                                    ...restrictionDto,
                                    sentenceId: sentence.id,
                                }
                            }))
                                .then(() => {
                                    return this.actionService.issueActions(
                                        judge,
                                        sentence,
                                        dto.immediateActions
                                    )
                                })
                        })
                })
            })
            .then(() => {
                response.status(HttpStatus.OK)
                response.send()
            })
    }

    @Put('edit/:id')
    @UseGuards(ModeratorGuard)
    async edit(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') sentenceId: number,
        @Body() dto: SentenceCreateDto,
    ) {
        this.authService.getUser(request)
            .then(judge => {
                return this.sequelize.transaction(() => {
                    return Sentence.update({
                        ...dto,
                        judgeId: judge.id,
                    }, {
                        where: {
                            id: sentenceId,
                        },
                    })
                        .then(async (result: [number, Sentence[]]) => {
                            if (result[0] === 0) {
                                response.status(HttpStatus.NOT_FOUND)
                                response.send()
                            } else {
                                const sentence = await Sentence.findOne({where: {id: sentenceId}});
                                await Restriction.destroy({
                                    where: {
                                        sentenceId: sentenceId,
                                    },
                                    force: true,
                                });
                                const existingKeys = {}
                                for (
                                    let action
                                    of (await ImmediateAction.findAll({
                                    where: {
                                        sentenceId: sentenceId,
                                    },
                                }))
                                    ) {
                                    if (!existingKeys.hasOwnProperty(action.typeId)) {
                                        existingKeys[action.typeId] = []
                                    }
                                    existingKeys[action.typeId].push(action.objectId)
                                }
                                return Restriction.bulkCreate(dto.restrictions.map(restrictionDto => {
                                    return {
                                        ...restrictionDto,
                                        sentenceId: sentenceId,
                                    }
                                }))
                                    .then(() => {
                                        return this.actionService.issueActions(
                                            judge,
                                            sentence,
                                            dto.immediateActions
                                                .filter(dto => {
                                                    return !existingKeys.hasOwnProperty(dto.typeId) ||
                                                        !existingKeys[dto.typeId].includes(dto.objectId)
                                                })
                                        )
                                    })
                                    .then(() => {
                                        response.status(HttpStatus.OK)
                                        response.send()
                                    })
                            }
                        })
                })
            })
    }


}
