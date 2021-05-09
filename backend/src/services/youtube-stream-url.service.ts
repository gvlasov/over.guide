import {Injectable} from '@nestjs/common';
import ytdl from "ytdl-core";

@Injectable()
export class YoutubeStreamUrlService {

    async getStreamUrl(videoId: string): Promise<string | undefined> {
        return await ytdl.getInfo(videoId)
            .then(
                info => {
                    return (info.formats.filter(
                        format => format.hasVideo
                            && format.quality === 'hd720'
                            && format.mimeType.match(/^video\//)
                    ))
                        [0]?.url;
                }
            )
    }

}
