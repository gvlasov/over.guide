"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportReasonId_1 = __importDefault(require("./ReportReasonId"));
const ReportReasonDto_1 = __importDefault(require("./dto/ReportReasonDto"));
const data = [
    {
        id: ReportReasonId_1.default.Spam,
        name: 'Spam',
        label: 'spam',
        dataName: 'spam',
        description: 'Exists only to promote product or service',
    },
    {
        id: ReportReasonId_1.default.NotEducational,
        name: 'Not educational',
        label: 'not educationial',
        dataName: 'not-educational',
        description: 'Doesn\'t contain any demonstrative examples and/or explanations',
    },
    {
        id: ReportReasonId_1.default.OffensiveLanguage,
        name: 'Offensive language',
        label: 'rude or abusive',
        dataName: 'offensive-language',
        description: 'Is unnecessarily offensive',
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        name: d.name,
        label: d.label,
        dataName: d.dataName,
        description: d.description,
    });
});
exports.default = map;
//# sourceMappingURL=reportReasons.js.map