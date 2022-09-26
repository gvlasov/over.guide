import { Model } from 'sequelize-typescript';
import { Guide } from "src/database/models/Guide";
import { User2TrainingGoal } from "src/database/models/User2TrainingGoal";
import UserDto from "data/dto/UserDto";
import { GuideHead } from "src/database/models/GuideHead";
import { Sentence } from "src/database/models/Sentence";
export declare class User extends Model<User> {
    name: string;
    battleNetUserId: string;
    trainingGoals: Array<Guide & {
        User2TrainingGoal: User2TrainingGoal;
    }>;
    banned: boolean;
    trainingGoalsHeads: Array<GuideHead & {
        User2TrainingGoal: User2TrainingGoal;
    }>;
    guideVotesReceivedCount: number;
    authoredGuides: Guide[];
    sentences: Sentence[];
    toDto(): UserDto;
}
