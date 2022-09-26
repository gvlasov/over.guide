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
var ThumbnailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThumbnailService = void 0;
const common_1 = require("@nestjs/common");
const youtube_screenshot_service_1 = require("./youtube-screenshot.service");
const YoutubeVideoExcerpt_1 = require("../database/models/YoutubeVideoExcerpt");
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
let ThumbnailService = ThumbnailService_1 = class ThumbnailService {
    constructor(youtubeScreenshotService) {
        this.youtubeScreenshotService = youtubeScreenshotService;
    }
    async updateThumbnail(excerpt) {
        if (excerpt.thumbnail === null) {
        }
        else {
            return fs_jetpack_1.default.dirAsync(ThumbnailService_1.getDirectoryPath())
                .then((dir) => {
                return this.youtubeScreenshotService.screenshot(excerpt.youtubeVideoId, excerpt.thumbnail, dir.cwd() + '/' + excerpt.id + '.jpg');
            });
        }
    }
    static getDirectoryPath() {
        return process.env.CDN_WEB_ROOT + '/images/custom-thumbnails';
    }
};
ThumbnailService = ThumbnailService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [youtube_screenshot_service_1.YoutubeScreenshotService])
], ThumbnailService);
exports.ThumbnailService = ThumbnailService;
//# sourceMappingURL=thumbnail.service.js.map