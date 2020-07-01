import {Body, Controller, HttpCode, Post, Put} from '@nestjs/common';
import YoutubeVideoExcerpt from "src/data/dto/YoutubeVideoExcerpt";
import {YoutubeVideoExcerpt as Model} from "src/database/models/YoutubeVideoExcerpt";

@Controller('youtube-video-excerpt')
export class YoutubeVideoExcerptController {

    @Put()
    @HttpCode(201)
    saveNew(@Body() excerpt: YoutubeVideoExcerpt) {
        return Model.create(excerpt)
    }

    @Post()
    update(@Body() excerpt: YoutubeVideoExcerpt) {
        Model.update(
            excerpt,
            {
                where: {youtubeVideoId: excerpt.youtubeVideoId}
            }
        )
    }

}
