import {Body, Controller, HttpCode, Post, Put} from '@nestjs/common';
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto";
import {YoutubeVideoExcerpt as Model} from "src/database/models/YoutubeVideoExcerpt";

@Controller('youtube-video-excerpt')
export class YoutubeVideoExcerptController {

    @Put()
    @HttpCode(201)
    saveNew(@Body() excerpt: YoutubeVideoExcerpsDto) {
        return Model.create(excerpt)
    }

    @Post()
    update(@Body() excerpt: YoutubeVideoExcerpsDto) {
        Model.update(
            excerpt,
            {
                where: {youtubeVideoId: excerpt.youtubeVideoId}
            }
        )
    }

}
