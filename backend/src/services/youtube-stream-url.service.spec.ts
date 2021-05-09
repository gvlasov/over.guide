import {nestTest} from "src/test/nest-test";
import {YoutubeStreamUrlService} from "src/services/youtube-stream-url.service";

describe(
    YoutubeStreamUrlService,
    nestTest(YoutubeStreamUrlService, (ctx) => {
            it('gets video stream url', async () => {
                const url = await ctx.service.getStreamUrl('Z-p6LZZI2Uc')
                expect(url.length).toBeGreaterThan(200)
            });
            it('works with webm video streams', async () => {
                const videoIdWithWebmHd720Stream = 'F12PJgyVKyA';
                const url = await ctx.service.getStreamUrl(videoIdWithWebmHd720Stream)
                expect(url).not.toBeUndefined()
            });
        }
    )
)
