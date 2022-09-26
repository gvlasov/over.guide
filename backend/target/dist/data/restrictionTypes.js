"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RestrictionTypeId_1 = __importDefault(require("./RestrictionTypeId"));
const RestrictionTypeDto_1 = __importDefault(require("./dto/RestrictionTypeDto"));
const PostTypeId_1 = __importDefault(require("./PostTypeId"));
const data = [
    {
        id: RestrictionTypeId_1.default.GuideCreationBan,
        labelFormat: 'Forbid creating guides',
        defenderLabel: 'You can\'t create guides'
    },
    {
        id: RestrictionTypeId_1.default.ForceGuidePrivate,
        labelFormat: 'Force private on this guide',
        defenderLabel: 'You can\'t make guide %s public',
        postTypeRestriction: [PostTypeId_1.default.Guide]
    },
    {
        id: RestrictionTypeId_1.default.CommentCreationBan,
        labelFormat: 'Forbid creating comments',
        defenderLabel: 'You can\'t comment',
    },
    {
        id: RestrictionTypeId_1.default.ReportingBan,
        labelFormat: 'Forbid reporting',
        defenderLabel: 'You can\'t report offences',
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        labelFormat: d.labelFormat,
        postTypeRestriction: d.postTypeRestriction,
        defenderLabel: d.defenderLabel,
    });
});
exports.default = map;
//# sourceMappingURL=restrictionTypes.js.map