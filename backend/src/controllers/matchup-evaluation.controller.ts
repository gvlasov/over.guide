import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Put,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import heroes from "src/data/heroes"
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import {Hero} from "src/database/models/Hero";
import {Request, Response} from "express";
import {AuthService} from "src/services/auth.service";
import {User} from "src/database/models/User";
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import HeroId from "data/HeroId";
import {Patch} from "src/database/models/Patch";

@Controller('matchup-evaluation')

export class MatchupEvaluationController {
    constructor(
        private readonly service: MatchupEvaluationService,
        private readonly authService: AuthService
    ) {

    }

    @Get()
    evaluate(subject: HeroId, object: HeroId) {
        return this.service.evaluate(
            heroes.get(subject),
            heroes.get(object)
        )
    }

    @Put()
    async createEvaluation(
        @Res() response: Response,
        @Req() request: Request,
        @Body() matchupEvaluation: MatchupEvaluationDto,
    ) {
        const currentUser: User = await this.authService.getUser(request)
        if (currentUser === null) {
            throw new UnauthorizedException()
        }
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
        console.log(request.ip)
        const patch = await Patch.findOne({
            order: [['date', 'DESC']]
        })
        if (existingEvaluation === null) {
            await MatchupEvaluation.create({
                subjectId: subjectId,
                objectId: objectId,
                score: matchupEvaluation.score,
                createdBy: currentUser,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.CREATED)
        } else {
            await existingEvaluation.update({
                subjectId: subjectId,
                objectId: objectId,
                score: matchupEvaluation.score,
                createdBy: currentUser,
                ip: request.ip,
                patchId: patch.id,
            })
            response.status(HttpStatus.ACCEPTED)
        }
        response.send()
    }

}
