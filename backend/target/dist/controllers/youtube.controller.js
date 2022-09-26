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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeController = void 0;
const common_1 = require("@nestjs/common");
const youtube_stream_url_service_1 = require("../services/youtube-stream-url.service");
let YoutubeController = class YoutubeController {
    constructor(youtubeStreamUrlService) {
        this.youtubeStreamUrlService = youtubeStreamUrlService;
    }
    getVideoStreamUrl(videoId) {
        return this.youtubeStreamUrlService.getStreamUrl(videoId);
    }
};
__decorate([
    common_1.Get('video-stream-url/:videoId'),
    __param(0, common_1.Param('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], YoutubeController.prototype, "getVideoStreamUrl", null);
YoutubeController = __decorate([
    common_1.Controller('youtube'),
    __metadata("design:paramtypes", [youtube_stream_url_service_1.YoutubeStreamUrlService])
], YoutubeController);
exports.YoutubeController = YoutubeController;
//# sourceMappingURL=youtube.controller.js.map