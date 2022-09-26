import { Model } from 'sequelize-typescript';
import { Restriction } from "src/database/models/Restriction";
import { ImmediateAction } from "src/database/models/ImmediateAction";
import { User } from "src/database/models/User";
export declare class Sentence extends Model<Sentence> {
    id: number;
    defenderId: number;
    judgeId: number;
    defender: User;
    judge: User;
    restrictions: Restriction[];
    immediateActions: ImmediateAction[];
    judgeCommentary: string | null;
}
