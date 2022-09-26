import { Model } from 'sequelize-typescript';
import { YoutubeVideoExcerpt } from "src/database/models/YoutubeVideoExcerpt";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
export declare class GuidePartVideo extends Model<GuidePartVideo> {
    id: number;
    excerptId: number;
    excerpt: YoutubeVideoExcerpt;
    toDto(): GuidePartVideoDto;
}
