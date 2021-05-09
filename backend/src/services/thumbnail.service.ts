import {Injectable} from "@nestjs/common";
import {YoutubeScreenshotService} from "src/services/youtube-screenshot.service";
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import jetpack from "fs-jetpack";


/**
 * Manages thumbnails creation and storage
 */
@Injectable()
export class ThumbnailService {


    constructor(
        private readonly youtubeScreenshotService: YoutubeScreenshotService
    ) {
    }

    async updateThumbnail(excerpt: YoutubeVideoExcerpt): Promise<void> {
        if (excerpt.thumbnail === null) {
        } else {
            return jetpack.dirAsync(ThumbnailService.getDirectoryPath())
                .then(
                    (dir) => {
                        return this.youtubeScreenshotService.screenshot(
                            excerpt.youtubeVideoId,
                            excerpt.thumbnail,
                            dir.cwd() + '/' + excerpt.id + '.jpg',
                        );
                    }
                )
        }
    }

    public static getDirectoryPath(): string {
        return process.env.CDN_WEB_ROOT + '/images/custom-thumbnails'
    }

}
