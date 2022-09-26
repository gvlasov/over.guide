"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KeyId_1 = __importDefault(require("./KeyId"));
const KeyDto_1 = __importDefault(require("./dto/KeyDto"));
const data = [
    {
        id: KeyId_1.default.Space,
        name: 'Space',
        dataName: 'space'
    },
    {
        id: KeyId_1.default.E,
        name: 'E',
        dataName: 'e'
    },
    {
        id: KeyId_1.default.Q,
        name: 'Q',
        dataName: 'q'
    },
    {
        id: KeyId_1.default.Shift,
        name: 'Shift',
        dataName: 'shift'
    },
    {
        id: KeyId_1.default.Ctrl,
        name: 'Ctrl',
        dataName: 'ctrl'
    },
    {
        id: KeyId_1.default.LMB,
        name: 'LMB',
        dataName: 'lmb'
    },
    {
        id: KeyId_1.default.RMB,
        name: 'RMB',
        dataName: 'rmb'
    },
    {
        id: KeyId_1.default.One,
        name: '1',
        dataName: 'one'
    },
    {
        id: KeyId_1.default.Two,
        name: '2',
        dataName: 'two'
    },
];
const map = new Map();
data.forEach(d => {
    const key = {
        id: d.id,
        name: d.name,
        dataName: d.dataName,
    };
    map.set(d.id, key);
});
exports.default = map;
//# sourceMappingURL=keys.js.map