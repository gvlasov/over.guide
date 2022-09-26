import { Model } from 'sequelize-typescript';
import { Sentence } from "src/database/models/Sentence";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
export declare class ImmediateAction extends Model<ImmediateAction> {
    private static uniqueKey;
    id: number;
    objectId: number;
    typeId: ImmediateActionTypeId;
    sentenceId: number;
    sentence: Sentence;
}
