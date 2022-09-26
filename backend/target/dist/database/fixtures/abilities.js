"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abilities_1 = __importDefault(require("../../data/abilities"));
const Ability_1 = require("../models/Ability");
const AbilityDto_1 = __importDefault(require("../../data/dto/AbilityDto"));
exports.default = async () => {
    return Promise.all(Array.from(abilities_1.default.values()).map(a => {
        return Ability_1.Ability.create({
            id: a.id,
            name: a.name,
            dataName: a.dataName,
            heroId: a.heroId,
        });
    }));
};
//# sourceMappingURL=abilities.js.map