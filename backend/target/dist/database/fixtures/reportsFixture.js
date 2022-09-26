"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const GuideHead_1 = require("../models/GuideHead");
const Report_1 = require("../models/Report");
const Comment_1 = require("../models/Comment");
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
const reportReasons_1 = __importDefault(require("../../data/reportReasons"));
exports.default = async (moduleRef) => {
    const reporter = await User_1.User.findOne();
    await GuideHead_1.GuideHead.findAll()
        .then(heads => heads.map(h => Report_1.Report.create({
        postId: h.guideId,
        postTypeId: PostTypeId_1.default.Guide,
        reporterId: reporter.id,
        reportReasonId: reportReasons_1.default.get(h.guideId % reportReasons_1.default.size).id,
        handled: 0,
    })));
    await Comment_1.Comment.findAll()
        .then(heads => heads.map(c => Report_1.Report.create({
        postId: c.id,
        postTypeId: PostTypeId_1.default.Comment,
        reporterId: reporter.id,
        reportReasonId: reportReasons_1.default.get(c.id % reportReasons_1.default.size).id,
        handled: 0,
    })));
};
//# sourceMappingURL=reportsFixture.js.map