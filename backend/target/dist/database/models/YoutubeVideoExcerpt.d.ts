import { Model } from 'sequelize-typescript';
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
export declare class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> {
    youtubeVideoId: string;
    startSeconds: number;
    endSeconds: number;
    thumbnail: number;
    toDto(): YoutubeVideoExcerptDto;
    get thumbnailUrl(): string;
}
