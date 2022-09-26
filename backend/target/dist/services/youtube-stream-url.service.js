"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeStreamUrlService = void 0;
const common_1 = require("@nestjs/common");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
let YoutubeStreamUrlService = class YoutubeStreamUrlService {
    async getStreamUrl(videoId) {
        return await ytdl_core_1.default.getInfo(videoId)
            .then(info => {
            var _a;
            return (_a = (info.formats.filter(format => format.hasVideo
                && format.quality === 'hd720'
                && format.mimeType.match(/^video\//)))[0]) === null || _a === void 0 ? void 0 : _a.url;
        });
    }
};
YoutubeStreamUrlService = __decorate([
    common_1.Injectable()
], YoutubeStreamUrlService);
exports.YoutubeStreamUrlService = YoutubeStreamUrlService;
//# sourceMappingURL=youtube-stream-url.service.js.map