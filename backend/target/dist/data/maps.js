"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapDto_1 = __importDefault(require("./dto/MapDto"));
const MapType_1 = __importDefault(require("./MapType"));
const MapName_1 = __importDefault(require("./MapName"));
const MapId_1 = __importDefault(require("./MapId"));
const data = [
    {
        id: 1,
        name: 'Busan',
        dataName: 'busan',
        type: MapType_1.default.Control,
    },
    {
        id: 2,
        name: 'Ilios',
        dataName: 'ilios',
        type: MapType_1.default.Control
    },
    {
        id: 3,
        name: 'Lijang Tower',
        dataName: 'lijang-tower',
        type: MapType_1.default.Control,
    },
    {
        id: 4,
        name: 'Nepal',
        dataName: 'nepal',
        type: MapType_1.default.Control,
    },
    {
        id: 5,
        name: 'Oasis',
        dataName: 'oasis',
        type: MapType_1.default.Control,
    },
    {
        id: 6,
        name: 'Hanamura',
        dataName: 'hanamura',
        type: MapType_1.default.Assault,
    },
    {
        id: 7,
        name: 'Horizon Lunar Colony',
        dataName: 'horizon-lunar-colony',
        type: MapType_1.default.Assault,
    },
    {
        id: 8,
        name: 'Paris',
        dataName: 'paris',
        type: MapType_1.default.Assault,
    },
    {
        id: 9,
        name: 'Temple of Anubis',
        dataName: 'temple-of-anubis',
        type: MapType_1.default.Assault,
    },
    {
        id: 10,
        name: 'Volskaya Industries',
        dataName: 'volskaya-industries',
        type: MapType_1.default.Assault,
    },
    {
        id: 11,
        name: 'Dorado',
        dataName: 'dorado',
        type: MapType_1.default.Escort,
    },
    {
        id: 12,
        name: 'Havana',
        dataName: 'havana',
        type: MapType_1.default.Escort,
    },
    {
        id: 13,
        name: 'Junkertown',
        dataName: 'junkertown',
        type: MapType_1.default.Escort,
    },
    {
        id: 14,
        name: 'Rialto',
        dataName: 'rialto',
        type: MapType_1.default.Escort,
    },
    {
        id: 15,
        name: 'Route 66',
        dataName: 'route-66',
        type: MapType_1.default.Escort,
    },
    {
        id: 16,
        name: 'Watchpoint: Gibraltar',
        dataName: 'watchpoint-gibraltar',
        type: MapType_1.default.Escort,
    },
    {
        id: 17,
        name: 'Blizzard World',
        dataName: 'blizzard-world',
        type: MapType_1.default.Hybrid,
    },
    {
        id: 18,
        name: 'Eichenwalde',
        dataName: 'eichenwalde',
        type: MapType_1.default.Hybrid,
    },
    {
        id: 19,
        name: 'Hollywood',
        dataName: 'hollywood',
        type: MapType_1.default.Hybrid,
    },
    {
        id: 20,
        name: 'King\'s Row',
        dataName: 'kings-row',
        type: MapType_1.default.Hybrid,
    },
    {
        id: 21,
        name: 'Numbani',
        dataName: 'numbani',
        type: MapType_1.default.Hybrid,
    },
];
const map = new Map();
data.forEach(d => {
    map.set(d.id, {
        id: d.id,
        name: d.name,
        dataName: d.dataName,
        type: d.type
    });
});
exports.default = map;
//# sourceMappingURL=maps.js.map