"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thematicTags_1 = __importDefault(require("../../data/thematicTags"));
const ThematicTag_1 = require("../models/ThematicTag");
const ThematicTagDto_1 = __importDefault(require("../../data/dto/ThematicTagDto"));
exports.default = async () => {
    return Promise.all(Array.from(thematicTags_1.default.values()).map(tag => {
        return ThematicTag_1.ThematicTag.create({
            id: tag.id,
            name: tag.name,
            dataName: tag.dataName
        });
    }));
};
//# sourceMappingURL=thematicTags.js.map