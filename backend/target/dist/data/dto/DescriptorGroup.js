"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptorGroup = void 0;
const HeroId_1 = __importDefault(require("../HeroId"));
const AbilityId_1 = __importDefault(require("../AbilityId"));
const GuideTheme_1 = __importDefault(require("../GuideTheme"));
const MapId_1 = __importDefault(require("../MapId"));
const GuideDescriptorDto_1 = __importDefault(require("./GuideDescriptorDto"));
const heroes_1 = __importDefault(require("../heroes"));
const HeroDto_1 = __importDefault(require("./HeroDto"));
const AbilityDto_1 = __importDefault(require("./AbilityDto"));
const ThematicTagDto_1 = __importDefault(require("./ThematicTagDto"));
const MapDto_1 = __importDefault(require("./MapDto"));
const abilities_1 = __importDefault(require("../abilities"));
const thematicTags_1 = __importDefault(require("../thematicTags"));
const maps_1 = __importDefault(require("../maps"));
class DescriptorGroup {
    constructor(id, name, data) {
        this.id = id;
        this.name = name;
        this.data = data;
    }
    valuesOf(query) {
        return query[this.name];
    }
    static get values() {
        return Object.values(DescriptorGroup);
    }
    get ids() {
        return Array.from(this.data.values()).map(it => it.id);
    }
}
exports.DescriptorGroup = DescriptorGroup;
DescriptorGroup.PlayerHeroes = new DescriptorGroup(0, 'playerHeroes', heroes_1.default);
DescriptorGroup.TeammateHeroes = new DescriptorGroup(1, 'teammateHeroes', heroes_1.default);
DescriptorGroup.EnemyHeroes = new DescriptorGroup(2, 'enemyHeroes', heroes_1.default);
DescriptorGroup.PlayerAbilities = new DescriptorGroup(3, 'playerAbilities', abilities_1.default);
DescriptorGroup.TeammateAbilities = new DescriptorGroup(4, 'teammateAbilities', abilities_1.default);
DescriptorGroup.EnemyAbilities = new DescriptorGroup(5, 'enemyAbilities', abilities_1.default);
DescriptorGroup.ThematicTags = new DescriptorGroup(6, 'thematicTags', thematicTags_1.default);
DescriptorGroup.MapTags = new DescriptorGroup(7, 'mapTags', maps_1.default);
//# sourceMappingURL=DescriptorGroup.js.map