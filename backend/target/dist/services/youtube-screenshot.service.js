"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeScreenshotService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const moment_1 = __importDefault(require("moment"));
const youtube_stream_url_service_1 = require("./youtube-stream-url.service");
const momentDurationFormatSetup = require("moment-duration-format");
let YoutubeScreenshotService = class YoutubeScreenshotService {
    constructor(youtubeStreamUrlService) {
        this.youtubeStreamUrlService = youtubeStreamUrlService;
    }
    async screenshot(videoId, timeSeconds, outputPath) {
        const ss = moment_1.default
            .duration(timeSeconds, 'second')
            .format('hh:mm:ss.SS', { trim: false });
        return this.youtubeStreamUrlService.getStreamUrl(videoId)
            .then(url => {
            if (url === void 0) {
                return Promise.reject(new Error('Could not get stream URL'));
            }
            else {
                return new Promise((resolve, reject) => {
                    const command = `ffmpeg -ss "${ss}" -i "${url}" -vframes 1 -q:v 2 "${outputPath}" -y -loglevel fatal`;
                    child_process_1.exec(command, (execException, stdout, stderr) => {
                        if (execException === null || execException.code === 0) {
                            resolve();
                        }
                        else {
                            reject({
                                code: execException.code,
                                stdout: stdout + stderr,
                            });
                        }
                    });
                });
            }
        });
    }
};
YoutubeScreenshotService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [youtube_stream_url_service_1.YoutubeStreamUrlService])
], YoutubeScreenshotService);
exports.YoutubeScreenshotService = YoutubeScreenshotService;
//# sourceMappingURL=youtube-screenshot.service.js.map