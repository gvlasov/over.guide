"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const heroes_1 = __importDefault(require("../fixtures/heroes"));
const thematicTags_1 = __importDefault(require("../fixtures/thematicTags"));
const maps_1 = __importDefault(require("../fixtures/maps"));
const abilities_1 = __importDefault(require("../fixtures/abilities"));
const ThematicTag_1 = require("../models/ThematicTag");
const Hero_1 = require("../models/Hero");
const Ability_1 = require("../models/Ability");
const Map_1 = require("../models/Map");
async function up(moduleRef, sequelize) {
    sequelize.addModels([
        Hero_1.Hero,
        ThematicTag_1.ThematicTag,
        Map_1.Map,
        Ability_1.Ability
    ]);
    await sequelize.transaction(t => {
        const options = {
            raw: true,
            transaction: t,
        };
        return sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0', options)
            .then(() => sequelize.truncate(options))
            .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options))
            .then(heroes_1.default)
            .then(thematicTags_1.default)
            .then(maps_1.default)
            .then(abilities_1.default);
    });
}
exports.up = up;
async function down(moduleRef, sequelize) {
    await Hero_1.Hero.truncate();
    await ThematicTag_1.ThematicTag.truncate();
    await Ability_1.Ability.truncate();
    await Map_1.Map.truncate();
}
exports.down = down;
//# sourceMappingURL=2021-02-17_22-11-00_game-data.js.map