import { Model } from 'sequelize-typescript';
import { Hero } from "./Hero";
import { Patch } from "./Patch";
import { User } from "src/database/models/User";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
export declare class MatchupEvaluation extends Model<MatchupEvaluation> {
    subjectId: number;
    subject: Hero;
    objectId: number;
    object: Hero;
    score: MatchupEvaluationUserScore;
    createdBy: User;
    ip: string;
    createdById: number;
    patchId: number;
    patch: Patch;
    toDto(): MatchupEvaluationDto;
}
