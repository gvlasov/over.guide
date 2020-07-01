import {Injectable} from '@nestjs/common';
import Hero from "src/data/dto/Hero";

import * as countersData from "src/data/counters.json"

@Injectable()
export class MatchupEvaluationService {

    evaluate(subject: Hero, object: Hero): number {
        const find = countersData.find(record => record[0] === subject.dataName && record[1] === object.dataName);
        return (find === undefined) ? 0 : this.extractScore(find[2])
    }

    private extractScore(scoreText: string): number {
        if (scoreText === '--') {
            return -8;
        } else if (scoreText === '-') {
            return -4;
        } else if (scoreText === '+') {
            return 4;
        } else if (scoreText === '++') {
            return 8;
        }
    }

}
