import { Model } from 'sequelize-typescript';
import GuidePartTextDto from "data/dto/GuidePartTextDto";
export declare class GuidePartText extends Model<GuidePartText> {
    id: number;
    contentMd: string;
    toDto(): GuidePartTextDto;
}
