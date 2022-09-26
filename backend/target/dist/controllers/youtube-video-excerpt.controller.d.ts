import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
import { YoutubeVideoExcerpt as Model } from "src/database/models/YoutubeVideoExcerpt";
export declare class YoutubeVideoExcerptController {
    saveNew(excerpt: YoutubeVideoExcerptDto): import("sequelize/types").Promise<Model>;
    update(excerpt: YoutubeVideoExcerptDto): void;
}
