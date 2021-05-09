import {Controller, Get, Param} from '@nestjs/common';
import {YoutubeStreamUrlService} from "src/services/youtube-stream-url.service";

@Controller('youtube')
export class YoutubeController {

    constructor(
        private readonly youtubeStreamUrlService: YoutubeStreamUrlService
    ) {
    }

    @Get('video-stream-url/:videoId')
    getVideoStreamUrl(
        @Param('videoId') videoId: string
    ): Promise<string> {
        return this.youtubeStreamUrlService.getStreamUrl(videoId)
    }


}
