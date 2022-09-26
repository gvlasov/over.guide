import HeroDto from "data/dto/HeroDto";
import PickContextDto from "data/dto/PickContextDto";
import AlternativeDto from "data/dto/AlternativeDto";
import { OldJsonMatchupEvaluationService } from "src/services/old-json-matchup-evaluation.service";
export declare class SuggestPickService {
    private readonly evaluation;
    constructor(evaluation: OldJsonMatchupEvaluationService);
    suggestPick(context: PickContextDto): AlternativeDto[];
    private static getMissingRole;
    pickScore(enemyHeroes: HeroDto[], hero: HeroDto): number;
}
