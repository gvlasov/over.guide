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
const common_1 = require("@nestjs/common");
const DescriptorGroup_1 = require("../data/dto/DescriptorGroup");
const HeroId_1 = __importDefault(require("../data/HeroId"));
const AbilityId_1 = __importDefault(require("../data/AbilityId"));
const MapId_1 = __importDefault(require("../data/MapId"));
const GuideTheme_1 = __importDefault(require("../data/GuideTheme"));
let TagIdService = class TagIdService {
    constructor() {
        this.storage = {};
        let i = 0;
        for (const group of DescriptorGroup_1.DescriptorGroup.values) {
            const groupTags = {};
            for (const tag of group.ids) {
                groupTags[tag] = i;
                i++;
            }
            this.storage[group.id] = groupTags;
        }
    }
    getTagId(group, tagId) {
        return this.storage[group.id][tagId];
    }
};
TagIdService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], TagIdService);
exports.default = TagIdService;
//# sourceMappingURL=TagIdSerivce.js.map