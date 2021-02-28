import {Injectable} from "@nestjs/common";
import ytdl from 'ytdl-core'
import {spawn} from 'child_process'
import moment from 'moment'

const momentDurationFormatSetup = require("moment-duration-format");

@Injectable()
export class YoutubeScreenshotService {

    async screenshot(
        videoUrl: string,
        timeSeconds: number,
        outputPath: string
    ): Promise<void> {
        const ss = moment
            .duration(timeSeconds, 'second')
            .format('hh:mm:ss.SS', {trim: false})
        return this.videoStreamDownloadUrl(videoUrl)
            .then(url =>
                new Promise(
                    (resolve, reject) => {
                        spawn(
                            "ffmpeg",
                            ['-ss', ss, '-i', url, '-vframes', '1', '-q:v', '2', outputPath, '-y', '-loglevel', 'quiet'],
                            {
                                env: process.env,
                            }
                        ).on('exit', (code) => {
                            if (code === 0) {
                                resolve()
                            } else {
                                console.log('reject')
                                reject()
                            }
                        })
                    }
                )
            )
    }

    async videoStreamDownloadUrl(videoUrl: string): Promise<string | undefined> {
        return await ytdl.getInfo(videoUrl)
            .then(
                info =>
                    info.formats.filter(
                        format => format.hasVideo
                            && format.quality === 'hd720'
                            && format.mimeType.match(/^video\/mp4/)
                    )
                        [0]?.url
            )
    }

}
