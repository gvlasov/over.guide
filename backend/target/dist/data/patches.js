"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PatchDto_1 = __importDefault(require("./dto/PatchDto"));
const data = [
    {
        id: 1,
        name: 'First patch',
        date: '2020-11-21 00:00:00',
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        name: d.name,
        date: d.date,
    });
});
exports.default = map;
//# sourceMappingURL=patches.js.map