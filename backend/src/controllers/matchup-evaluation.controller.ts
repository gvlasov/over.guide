import {Controller, Get} from '@nestjs/common';
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import HeroDataNames from "src/data/HeroDataNames";
import heroes from "src/data/heroes"

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

}
