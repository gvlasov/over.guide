"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuideDescriptorDto_1 = __importDefault(require("./GuideDescriptorDto"));
const HeroId_1 = __importDefault(require("../HeroId"));
const MapId_1 = __importDefault(require("../MapId"));
const GuideTheme_1 = __importDefault(require("../GuideTheme"));
const AbilityId_1 = __importDefault(require("../AbilityId"));
class GuideDescriptorQuickie {
    constructor(dto) {
        this.playerHeroes = [];
        this.playerAbilities = [];
        this.teammateHeroes = [];
        this.teammateAbilities = [];
        this.enemyHeroes = [];
        this.enemyAbilities = [];
        this.mapTags = [];
        this.thematicTags = [];
        this.exact = false;
        this.playerHeroes = dto.playerHeroes || [];
        this.playerAbilities = dto.playerAbilities || [];
        this.teammateHeroes = dto.teammateHeroes || [];
        this.teammateAbilities = dto.teammateAbilities || [];
        this.enemyHeroes = dto.enemyHeroes || [];
        this.enemyAbilities = dto.enemyAbilities || [];
        this.mapTags = dto.mapTags || [];
        this.thematicTags = dto.thematicTags || [];
        this.exact = dto.exact || false;
    }
}
exports.default = GuideDescriptorQuickie;
//# sourceMappingURL=GuideDescriptorQuickie.js.map