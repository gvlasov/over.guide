import {Injectable} from "@nestjs/common";
import {exec, ExecException} from 'child_process'
import moment from 'moment'
import {YoutubeStreamUrlService} from "src/services/youtube-stream-url.service";

const momentDurationFormatSetup = require("moment-duration-format");

type FfmpegResult = {
    code: number,
    stderr: string,
}

@Injectable()
export class YoutubeScreenshotService {

    constructor(
        private readonly youtubeStreamUrlService: YoutubeStreamUrlService
    ) {
    }

    async screenshot(
        videoId: string,
        timeSeconds: number,
        outputPath: string
    ): Promise<void> {
        const ss = moment
            .duration(timeSeconds, 'second')
            .format('hh:mm:ss.SS', {trim: false})
        return this.youtubeStreamUrlService.getStreamUrl(videoId)
            .then(url => {
                if (url === void 0) {
                    return Promise.reject(new Error('Could not get stream URL'))
                } else {
                    return new Promise(
                        (resolve, reject) => {
                            const command = `ffmpeg -ss "${ss}" -i "${url}" -vframes 1 -q:v 2 "${outputPath}" -y -loglevel fatal`;
                            // console.log(command)
                            exec(
                                command,
                                (execException: ExecException | null, stdout: string, stderr: string) => {
                                    if (execException === null || execException.code === 0) {
                                        // console.log('stdout',stdout)
                                        // console.log('stderr',stderr)
                                        resolve()
                                    } else {
                                        reject({
                                            code: execException.code,
                                            stdout: stdout + stderr,
                                        })
                                    }
                                }
                            );
                        }
                    )
                }
            })
    }

}
