"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heroes_1 = __importDefault(require("../../data/heroes"));
const Hero_1 = require("../models/Hero");
const HeroDto_1 = __importDefault(require("../../data/dto/HeroDto"));
exports.default = async () => {
    return Promise.all(Array.from(heroes_1.default.values()).map(async (hero) => Hero_1.Hero.create(hero)));
};
//# sourceMappingURL=heroes.js.map