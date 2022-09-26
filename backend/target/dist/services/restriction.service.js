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
exports.RestrictionService = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../database/models/User");
const RestrictionTypeId_1 = __importDefault(require("../data/RestrictionTypeId"));
const Sentence_1 = require("../database/models/Sentence");
const Restriction_1 = require("../database/models/Restriction");
const sequelize_1 = require("sequelize");
let RestrictionService = class RestrictionService {
    constructor() {
    }
    async hasActiveRestriction(user, restrictionType, objectId = null) {
        return Sentence_1.Sentence.findOne({
            where: {
                defenderId: user.id,
            },
            include: [
                {
                    model: Restriction_1.Restriction,
                    as: 'restrictions',
                    required: true,
                    where: {
                        typeId: restrictionType,
                        objectId: objectId,
                        end: {
                            [sequelize_1.Op.gt]: new Date().toISOString()
                        },
                    }
                }
            ],
        })
            .then(sentence => {
            return sentence !== null;
        });
    }
};
RestrictionService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], RestrictionService);
exports.RestrictionService = RestrictionService;
//# sourceMappingURL=restriction.service.js.map