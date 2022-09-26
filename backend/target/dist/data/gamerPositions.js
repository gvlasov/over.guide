"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GamerPositionDto_1 = __importDefault(require("./dto/GamerPositionDto"));
const GamerPositionId_1 = __importDefault(require("./GamerPositionId"));
const data = [
    {
        id: GamerPositionId_1.default.Players,
        dataName: 'player',
        plural: 'Players',
    },
    {
        id: GamerPositionId_1.default.Teammates,
        dataName: 'teammate',
        plural: 'Teammates',
    },
    {
        id: GamerPositionId_1.default.Enemies,
        dataName: 'enemy',
        plural: 'Enemies',
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        dataName: d.dataName,
        plural: d.plural,
    });
});
exports.default = map;
//# sourceMappingURL=gamerPositions.js.map