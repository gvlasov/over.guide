import {Controller, Get, Post} from '@nestjs/common';
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import HeroDataNames from "src/data/HeroDataNames";
import heroes from "src/data/heroes"
import {MatchupEvaluation} from "src/database/models/MatchupEvaluation";
import {Hero} from "src/database/models/Hero";
import MatchupEvaluationUserScore from "src/data/MatchupEvaluationUserScore";
import {User} from "src/database/models/User";

@Controller('matchup-evaluation')
export class MatchupEvaluationController {
    constructor(
        private readonly service: MatchupEvaluationService
    ) {

    }

    @Get()
    evaluate(subject: HeroDataNames, object: HeroDataNames) {
        return this.service.evaluate(
            heroes.get(subject),
            heroes.get(object)
        )
    }

    @Post()
    async createEvaluation(
        subject: HeroDataNames,
        object: HeroDataNames,
        score: MatchupEvaluationUserScore
    ) {
        const currentUser = await User.findOne();
        const subjectId = (await Hero.findOne({where: {dataName: subject}})).id;
        const objectId = (await Hero.findOne({where: {dataName: object}})).id;
        const existingEvaluation = await MatchupEvaluation.findOne({
            where: {
                createdById: currentUser.id,
                subjectId: subjectId,
                objectId: objectId
            }
        });
        if (existingEvaluation === null) {
            MatchupEvaluation.create({
                subjectId: subjectId,
                objectId: objectId,
                score: score,
                createdBy: currentUser,
            })
        } else {
            existingEvaluation.update({
                subjectId: subjectId,
                objectId: objectId,
                score: score,
                createdBy: currentUser,
            })
        }
    }

}
