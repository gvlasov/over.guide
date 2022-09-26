import { YoutubeScreenshotService } from "src/services/youtube-screenshot.service";
import { YoutubeVideoExcerpt } from "src/database/models/YoutubeVideoExcerpt";
export declare class ThumbnailService {
    private readonly youtubeScreenshotService;
    constructor(youtubeScreenshotService: YoutubeScreenshotService);
    updateThumbnail(excerpt: YoutubeVideoExcerpt): Promise<void>;
    static getDirectoryPath(): string;
}
