"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HeroId_1 = __importDefault(require("../HeroId"));
const MapId_1 = __importDefault(require("../MapId"));
const GuideTheme_1 = __importDefault(require("../GuideTheme"));
const AbilityId_1 = __importDefault(require("../AbilityId"));
const GuideSearchQueryDto_1 = __importDefault(require("./GuideSearchQueryDto"));
class GuideSearchQueryQuickie {
    constructor(dto) {
        this.playerHeroes = [];
        this.playerAbilities = [];
        this.teammateHeroes = [];
        this.teammateAbilities = [];
        this.enemyHeroes = [];
        this.enemyAbilities = [];
        this.mapTags = [];
        this.thematicTags = [];
        this.clientAlreadyHasGuideIds = [];
        this.exact = false;
        this.playerHeroes = dto.playerHeroes || [];
        this.playerAbilities = dto.playerAbilities || [];
        this.teammateHeroes = dto.teammateHeroes || [];
        this.teammateAbilities = dto.teammateAbilities || [];
        this.enemyHeroes = dto.enemyHeroes || [];
        this.enemyAbilities = dto.enemyAbilities || [];
        this.mapTags = dto.mapTags || [];
        this.thematicTags = dto.thematicTags || [];
        this.clientAlreadyHasGuideIds = dto.clientAlreadyHasGuideIds || [];
        this.exact = dto.exact || false;
    }
}
exports.default = GuideSearchQueryQuickie;
//# sourceMappingURL=GuideSearchQueryQuickie.js.map