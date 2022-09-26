"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maps_1 = __importDefault(require("../../data/maps"));
const Map_1 = require("../models/Map");
const MapDto_1 = __importDefault(require("../../data/dto/MapDto"));
exports.default = async () => {
    return Promise.all(Array.from(maps_1.default.values()).map(map => {
        return Map_1.Map.create({
            id: map.id,
            name: map.name,
            type: map.type,
            dataName: map.dataName
        });
    }));
};
//# sourceMappingURL=maps.js.map