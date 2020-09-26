import {Body, Controller, HttpCode, Post, Put} from '@nestjs/common';
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
import {YoutubeVideoExcerpt as Model} from "src/database/models/YoutubeVideoExcerpt";

@Controller('youtube-video-excerpt')
export class YoutubeVideoExcerptController {

    @Put()
    @HttpCode(201)
    saveNew(@Body() excerpt: YoutubeVideoExcerptDto) {
        return Model.create(excerpt)
    }

    @Post()
    update(@Body() excerpt: YoutubeVideoExcerptDto) {
        Model.update(
            excerpt,
            {
                where: {youtubeVideoId: excerpt.youtubeVideoId}
            }
        )
    }

}
