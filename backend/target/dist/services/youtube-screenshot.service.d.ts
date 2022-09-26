import { YoutubeStreamUrlService } from "src/services/youtube-stream-url.service";
export declare class YoutubeScreenshotService {
    private readonly youtubeStreamUrlService;
    constructor(youtubeStreamUrlService: YoutubeStreamUrlService);
    screenshot(videoId: string, timeSeconds: number, outputPath: string): Promise<void>;
}
