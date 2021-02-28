import {nestTest} from "src/test/nest-test";
import {YoutubeScreenshotService} from "src/services/youtube-screenshot.service";
import * as fs from "fs";

describe(
    YoutubeScreenshotService,
    nestTest(YoutubeScreenshotService, (ctx) => {
            it('creates screenshot of a youtube video', async () => {
                const outputPath = '/tmp/smol-guide-test_screenshot.jpg'
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath)
                }
                await ctx.service.screenshot(
                    'https://www.youtube.com/watch?v=Z-p6LZZI2Uc',
                    492.49,
                    outputPath
                )
                expect(fs.existsSync(outputPath))
                expect(fs.statSync(outputPath).size).toBeGreaterThan(100000)
            });
            it('fails meaningfully when trying to create a screenshot out of video bounds', async () => {
                const outputPath = '/tmp/smol-guide-test_screenshot.jpg'
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath)
                }
                expect(ctx.service.screenshot(
                    'https://www.youtube.com/watch?v=F12PJgyVKyA',
                    1000,
                    outputPath
                )).rejects
                expect(!fs.existsSync(outputPath))
            });
        }
    )
)
