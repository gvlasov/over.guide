"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guide_history_entry_service_1 = require("../../../services/guide-history-entry.service");
const Guide_1 = require("../../models/Guide");
const User_1 = require("../../models/User");
const GuidePartTextDto_1 = __importDefault(require("../../../data/dto/GuidePartTextDto"));
const DescriptorGenerator_1 = __importDefault(require("../../../data/generators/DescriptorGenerator"));
const GuidePartVideoDto_1 = __importDefault(require("../../../data/dto/GuidePartVideoDto"));
const abilities_1 = __importDefault(require("../../../data/abilities"));
const content_hash_service_1 = require("../../../services/content-hash.service");
const GuideHistoryEntryAppendDto_1 = __importDefault(require("../../../data/dto/GuideHistoryEntryAppendDto"));
function createGuideTestingFixture(size) {
    return async (moduleRef) => {
        const entryService = moduleRef.get(guide_history_entry_service_1.GuideHistoryEntryService);
        const user = await User_1.User.create({
            name: "user man",
            battleNetUserId: "12341234",
            banned: 0,
        });
        const videoId = 'vGc4mg5pul4';
        const generator = new DescriptorGenerator_1.default({
            numberOfThematicTags: [1, 3],
            numberOfHeroTags: [1, 4],
            abilitiesPerHero: [2, 3],
        });
        const contentHashService = moduleRef.get(content_hash_service_1.ContentHashService);
        for (let i = 0; i < size; i++) {
            const guide = await Guide_1.Guide.create({
                authorId: user.id,
                isPublic: 1,
            });
            const parts = [];
            if (Math.random() * 10 < 3) {
                parts.push({
                    excerpt: {
                        startSeconds: 155,
                        endSeconds: 159,
                        youtubeVideoId: videoId,
                    },
                    kind: 'video'
                });
            }
            if (Math.random() * 10 < 8) {
                parts.push({
                    contentMd: abilities_1.default.get(3).description,
                    kind: 'text'
                });
            }
            if (parts.length === 0) {
                parts.push({
                    contentMd: 'asdf ' + i,
                    kind: 'text'
                });
            }
            const descriptor = generator.generate(i);
            await entryService.append({
                guideId: guide.id,
                parts: parts,
                descriptor: descriptor,
                isPublic: true,
            }, user);
        }
    };
}
exports.default = createGuideTestingFixture;
//# sourceMappingURL=guide-testing.js.map