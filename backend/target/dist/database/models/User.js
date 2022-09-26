"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = __importStar(require("sequelize"));
const Guide_1 = require("./Guide");
const User2TrainingGoal_1 = require("./User2TrainingGoal");
const UserDto_1 = __importDefault(require("../../data/dto/UserDto"));
const GuideHead_1 = require("./GuideHead");
const Vote_1 = require("./Vote");
const Restriction_1 = require("./Restriction");
const Sentence_1 = require("./Sentence");
let User = class User extends sequelize_typescript_1.Model {
    toDto() {
        return {
            id: this.id,
            name: this.name
        };
    }
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Unique({ name: 'name', msg: '' }),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(20) }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Unique({ name: 'battleNetUserId', msg: '' }),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(15) }),
    __metadata("design:type", String)
], User.prototype, "battleNetUserId", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Guide_1.Guide, {
        through: {
            model: () => User2TrainingGoal_1.User2TrainingGoal,
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "trainingGoals", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TINYINT() }),
    __metadata("design:type", Boolean)
], User.prototype, "banned", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => GuideHead_1.GuideHead, {
        through: {
            model: () => User2TrainingGoal_1.User2TrainingGoal,
        },
        foreignKey: 'userId',
        otherKey: 'guideId',
        targetKey: 'guideId',
        sourceKey: 'id',
        constraints: false,
    }),
    __metadata("design:type", Array)
], User.prototype, "trainingGoalsHeads", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.VIRTUAL(sequelize_1.DataTypes.INTEGER)
    }),
    __metadata("design:type", Number)
], User.prototype, "guideVotesReceivedCount", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Guide_1.Guide, 'authorId'),
    __metadata("design:type", Array)
], User.prototype, "authoredGuides", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Sentence_1.Sentence, 'defenderId'),
    __metadata("design:type", Array)
], User.prototype, "sentences", void 0);
User = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'User',
            plural: 'Users',
        },
        scopes: {
            withVotesCount: () => {
                return {
                    attributes: {
                        include: [
                            [
                                sequelize_1.default.fn('count', sequelize_1.default.col('authoredGuides.votes.id')),
                                'guideVotesReceivedCount',
                            ],
                        ]
                    },
                    include: [{
                            model: Guide_1.Guide,
                            as: 'authoredGuides',
                            include: [
                                {
                                    model: Vote_1.Vote,
                                    as: 'votes',
                                    attributes: []
                                }
                            ],
                            attributes: [],
                        }],
                    group: ['User.id'],
                };
            },
            activeRestrictions: () => {
                return {
                    include: [
                        {
                            model: Sentence_1.Sentence,
                            as: 'sentences',
                            include: [
                                {
                                    model: Restriction_1.Restriction,
                                    as: 'restrictions',
                                    where: {
                                        end: {
                                            [sequelize_1.Op.gt]: new Date().toISOString(),
                                        },
                                    },
                                },
                            ],
                        }
                    ],
                    group: ['User.id', 'sentences.id'],
                };
            },
        }
    })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map