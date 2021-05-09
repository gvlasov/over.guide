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
                    'Z-p6LZZI2Uc',
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
                const secondsGreaterThanVideoEnd = 1000;
                expect(ctx.service.screenshot(
                    'F12PJgyVKyA',
                    secondsGreaterThanVideoEnd,
                    outputPath
                )).rejects
                expect(!fs.existsSync(outputPath))
            });
            it('rejects if can\'t save file', async () => {
                expect(!fs.existsSync('/tmp/non-existent-dir/'))
                const outputPath = '/tmp/non-existent-dir/smol-guide-test_screenshot.jpg'
                const screenshot = ctx.service.screenshot(
                    'F12PJgyVKyA',
                    5,
                    outputPath
                )
                    .catch(result => {
                        expect(result.code).toStrictEqual(1)
                    })
                expect(screenshot).rejects
                // Не получилось протестировать получение сообщения об ошибке от ffmpeg
                await screenshot
                expect(!fs.existsSync(outputPath))
            });
        }
    )
)
