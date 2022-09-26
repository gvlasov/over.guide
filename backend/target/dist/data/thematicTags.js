"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ThematicTagDto_1 = __importDefault(require("./dto/ThematicTagDto"));
const GuideTheme_1 = __importDefault(require("./GuideTheme"));
const data = [
    {
        id: GuideTheme_1.default.Psychology,
        name: 'Psychology',
        dataName: 'psychology'
    },
    {
        id: GuideTheme_1.default["Workshop training"],
        name: 'Workshop training',
        dataName: 'workshop-training',
    },
    {
        id: GuideTheme_1.default.Positioning,
        name: 'Positioning',
        dataName: 'positioning',
    },
    {
        id: GuideTheme_1.default["Game sense"],
        name: 'Game sense',
        dataName: 'game-sense',
    },
    {
        id: GuideTheme_1.default.Communication,
        name: 'Communication',
        dataName: 'communication',
    },
    {
        id: GuideTheme_1.default["Target priority"],
        name: 'Target priority',
        dataName: 'target-priority',
    },
    {
        id: GuideTheme_1.default.Aim,
        name: 'Aim',
        dataName: 'aim',
    },
    {
        id: GuideTheme_1.default.Learning,
        name: 'Learning',
        dataName: 'learning',
    },
    {
        id: GuideTheme_1.default.Principle,
        name: 'Principle',
        dataName: 'principle',
    },
    {
        id: GuideTheme_1.default.Techinque,
        name: 'Technique',
        dataName: 'technique',
    },
    {
        id: GuideTheme_1.default.Roles,
        name: 'Roles',
        dataName: 'Roles',
    },
    {
        id: GuideTheme_1.default.Attack,
        name: 'Attack',
        dataName: 'attack',
    },
    {
        id: GuideTheme_1.default.Defense,
        name: 'Defense',
        dataName: 'defense',
    },
    {
        id: GuideTheme_1.default.Movement,
        name: 'Movement',
        dataName: 'movement',
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        name: d.name,
        dataName: d.dataName,
    });
});
exports.default = map;
//# sourceMappingURL=thematicTags.js.map