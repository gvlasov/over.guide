"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImmediateActionTypeId_1 = __importDefault(require("./ImmediateActionTypeId"));
const ImmediateActionTypeDto_1 = __importDefault(require("./dto/ImmediateActionTypeDto"));
const PostTypeId_1 = __importDefault(require("./PostTypeId"));
const data = [
    {
        id: ImmediateActionTypeId_1.default.DeactivateAllGuides,
        labelFormat: 'Deactivate all guides',
        defenderLabel: 'All your guides are deleted'
    },
    {
        id: ImmediateActionTypeId_1.default.DeleteAllGuideComments,
        labelFormat: 'Delete all guide comments',
        defenderLabel: 'All your comments to guides are deleted'
    },
    {
        id: ImmediateActionTypeId_1.default.DeactivateGuide,
        labelFormat: 'Deactivate this guide',
        defenderLabel: 'Your guide %s is deactivated',
        postTypeRestriction: [PostTypeId_1.default.Guide]
    },
    {
        id: ImmediateActionTypeId_1.default.DeleteComment,
        labelFormat: 'Delete this comment',
        defenderLabel: 'Your comment %s is deleted',
        postTypeRestriction: [PostTypeId_1.default.Comment]
    },
    {
        id: ImmediateActionTypeId_1.default.IgnoreAllCurrentReports,
        labelFormat: 'Ignore all current reports',
        defenderLabel: 'All reports you left are ignored',
    },
    {
        id: ImmediateActionTypeId_1.default.BanAccount,
        labelFormat: 'Ban account',
        defenderLabel: 'Your account is banned',
    },
    {
        id: ImmediateActionTypeId_1.default.MakeGuidePrivate,
        labelFormat: 'Make guide private',
        defenderLabel: 'Guide %s is changed from public to private',
        postTypeRestriction: [PostTypeId_1.default.Guide]
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        labelFormat: d.labelFormat,
        defenderLabel: d.defenderLabel,
        postTypeRestriction: d.postTypeRestriction,
    });
});
exports.default = map;
//# sourceMappingURL=immediateActionTypes.js.map