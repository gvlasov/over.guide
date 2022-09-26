"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const GuideHead_1 = require("../models/GuideHead");
const Comment_1 = require("../models/Comment");
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
exports.default = async (moduleRef) => {
    const contents = [
        'привет',
        'здорово',
        'а как играть на ане',
        'hello',
        'fuck you',
        'cool',
        'what is this guied I dont even',
        'i hate doomfist',
        'i am doomfist',
        'this is a good guide',
        'thanks',
        '1',
    ];
    const commenter = await User_1.User.findOne();
    const currentTime = new Date().toISOString();
    await GuideHead_1.GuideHead.findAll()
        .then(heads => heads.map(async (h) => {
        const comments = [];
        const commentCount = h.guideId % 10;
        for (let i = 0; i < commentCount; i++) {
            const parentId = comments.length === 0 || Math.random() < 0.3
                ? null
                : comments[(h.guideId * 7) % comments.length].id;
            const deleted = Math.random() < 0.04;
            comments.push(await Comment_1.Comment.create({
                parentId: parentId,
                postId: h.guideId,
                postType: PostTypeId_1.default.Guide,
                content: contents[Math.round((contents.length - 1) * Math.random())],
                authorId: commenter.id,
                createdAt: currentTime,
                updatedAt: currentTime,
                deactivatedById: deleted ? commenter.id : null,
                deactivatedAt: deleted ? currentTime : null,
            }));
        }
        return comments;
    }));
};
//# sourceMappingURL=commentsFixture.js.map