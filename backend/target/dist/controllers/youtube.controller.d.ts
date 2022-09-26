import { YoutubeStreamUrlService } from "src/services/youtube-stream-url.service";
export declare class YoutubeController {
    private readonly youtubeStreamUrlService;
    constructor(youtubeStreamUrlService: YoutubeStreamUrlService);
    getVideoStreamUrl(videoId: string): Promise<string>;
}
