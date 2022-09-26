import { Model } from 'sequelize-typescript';
import RestrictionTypeId from "data/RestrictionTypeId";
import { Sentence } from "src/database/models/Sentence";
import RestrictionReadDto from "data/dto/RestrictionReadDto";
export declare class Restriction extends Model<Restriction> {
    private static uniqueKey;
    id: number;
    typeId: RestrictionTypeId;
    objectId: number;
    sentenceId: number;
    sentence: Sentence;
    start: Date;
    end: Date;
    toDto(): RestrictionReadDto;
}
