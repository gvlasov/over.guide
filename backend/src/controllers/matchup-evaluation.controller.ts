import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    Put,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import {Hero} from "src/database/models/Hero";
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
        @Body() matchupEvaluation: MatchupEvaluationDto,
    ) {
        const currentUser: User = await this.authService.getUser(request)
        const subject = await Hero.findOne({where: {dataName: matchupEvaluation.subject}});
        if (subject === null) {
            throw new BadRequestException()
        }
        const subjectId = subject.id;
        const object = await Hero.findOne({where: {dataName: matchupEvaluation.object}});
        if (object === null) {
            throw new BadRequestException()
        }
        const objectId = object.id;
        const existingEvaluation = await MatchupEvaluation.findOne({
            where: {
                createdById: currentUser.id,
                subjectId: subjectId,
                objectId: objectId
            }
        });
        const patch = await Patch.findOne({
            order: [['date', 'DESC']]
        })
        if (existingEvaluation === null) {
            await MatchupEvaluation.create({
                subjectId: subjectId,
                objectId: objectId,
                score: matchupEvaluation.score,
                createdById: currentUser.id,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.CREATED)
        } else {
            await existingEvaluation.update({
                subjectId: subjectId,
                objectId: objectId,
                score: matchupEvaluation.score,
                createdById: currentUser.id,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.ACCEPTED)
        }
        response.send()
    }

}
