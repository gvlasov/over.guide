"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideDescriptor = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Hero_1 = require("./Hero");
const GuideDescriptor2PlayerHero_1 = require("./GuideDescriptor2PlayerHero");
const GuideDescriptor2TeammateHero_1 = require("./GuideDescriptor2TeammateHero");
const GuideDescriptor2EnemyHero_1 = require("./GuideDescriptor2EnemyHero");
const Map_1 = require("./Map");
const GuideDescriptor2Map_1 = require("./GuideDescriptor2Map");
const ThematicTag_1 = require("./ThematicTag");
const GuideDescriptor2ThematicTag_1 = require("./GuideDescriptor2ThematicTag");
const sequelize_1 = require("sequelize");
const GuideDescriptorDto_1 = __importDefault(require("../../data/dto/GuideDescriptorDto"));
const Ability_1 = require("./Ability");
const GuideDescriptor2PlayerAbility_1 = require("./GuideDescriptor2PlayerAbility");
const GuideDescriptor2TeammateAbility_1 = require("./GuideDescriptor2TeammateAbility");
const GuideDescriptor2EnemyAbility_1 = require("./GuideDescriptor2EnemyAbility");
let GuideDescriptor = class GuideDescriptor extends sequelize_typescript_1.Model {
    toDto() {
        return {
            playerHeroes: this.players.map(hero => hero.id),
            playerAbilities: this.playerAbilities.map(ability => ability.id),
            teammateHeroes: this.teammates.map(hero => hero.id),
            teammateAbilities: this.teammateAbilities.map(ability => ability.id),
            enemyHeroes: this.enemies.map(hero => hero.id),
            enemyAbilities: this.enemyAbilities.map(ability => ability.id),
            mapTags: this.maps.map(map => map.id),
            thematicTags: this.thematicTags.map(tag => tag.id),
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideDescriptor.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Hero_1.Hero, () => GuideDescriptor2PlayerHero_1.GuideDescriptor2PlayerHero),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "players", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Ability_1.Ability, () => GuideDescriptor2PlayerAbility_1.GuideDescriptor2PlayerAbility),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "playerAbilities", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Hero_1.Hero, () => GuideDescriptor2TeammateHero_1.GuideDescriptor2TeammateHero),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "teammates", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Ability_1.Ability, () => GuideDescriptor2TeammateAbility_1.GuideDescriptor2TeammateAbility),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "teammateAbilities", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Hero_1.Hero, () => GuideDescriptor2EnemyHero_1.GuideDescriptor2EnemyHero),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "enemies", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Ability_1.Ability, () => GuideDescriptor2EnemyAbility_1.GuideDescriptor2EnemyAbility),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "enemyAbilities", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Map_1.Map, {
        through: {
            model: () => GuideDescriptor2Map_1.GuideDescriptor2Map,
        }
    }),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "maps", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => ThematicTag_1.ThematicTag, {
        through: {
            model: () => GuideDescriptor2ThematicTag_1.GuideDescriptor2ThematicTag,
        }
    }),
    __metadata("design:type", Array)
], GuideDescriptor.prototype, "thematicTags", void 0);
__decorate([
    sequelize_typescript_1.Unique({ name: 'contentHash', msg: '' }),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.CHAR(32) }),
    __metadata("design:type", String)
], GuideDescriptor.prototype, "contentHash", void 0);
GuideDescriptor = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuideDescriptor',
            plural: 'GuideDescriptors',
        },
        updatedAt: false,
    })
], GuideDescriptor);
exports.GuideDescriptor = GuideDescriptor;
//# sourceMappingURL=GuideDescriptor.js.map