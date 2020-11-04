import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Put,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import {Request, Response} from "express";
import {AuthService} from "src/services/auth.service";
import {User} from "src/database/models/User";
import {Patch} from "src/database/models/Patch";
import {AuthenticatedGuard} from "src/services/authenticated.guard";

@Controller('matchup-evaluation')
export class MatchupEvaluationController {
    constructor(
        private readonly authService: AuthService
    ) {

    }

    @UseGuards(AuthenticatedGuard)
    @Put()
    async createEvaluation(
        @Res() response: Response,
        @Req() request: Request,
        @Body() dto: MatchupEvaluationDto,
    ) {
        const currentUser: User = await this.authService.getUser(request)
        const existingEvaluation = await MatchupEvaluation.findOne({
            where: {
                createdById: currentUser.id,
                subjectId: dto.subjectId,
                objectId: dto.objectId,
            }
        });
        const patch = await Patch.findOne({
            order: [['date', 'DESC']]
        })
        if (existingEvaluation === null) {
            await MatchupEvaluation.create({
                subjectId: dto.subjectId,
                objectId: dto.objectId,
                score: dto.score,
                createdById: currentUser.id,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.CREATED)
        } else {
            await existingEvaluation.update({
                subjectId: dto.subjectId,
                objectId: dto.objectId,
                score: dto.score,
                createdById: currentUser.id,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.ACCEPTED)
        }
        response.send()
    }

    @UseGuards(AuthenticatedGuard)
    @Get('my')
    async myEvaluations(
        @Req() request: Request,
    ) {
        const currentUser: User = await this.authService.getUser(request)
        return MatchupEvaluation.findAll({
            where: {
                createdById: currentUser.id
            },
        })
            .then(evaluations => evaluations.map(evaluation => evaluation.toDto()))

    }


}
