import {Injectable} from '@nestjs/common';
import HeroDto from "data/dto/HeroDto";

import countersData from "src/data/counters.json"

@Injectable()
export class OldJsonMatchupEvaluationService {

    evaluate(subject: HeroDto, object: HeroDto): number {
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
