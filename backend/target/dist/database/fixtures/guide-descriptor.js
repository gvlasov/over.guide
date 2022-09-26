"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuideDescriptor_1 = require("../models/GuideDescriptor");
const GuideDescriptor2TeammateHero_1 = require("../models/GuideDescriptor2TeammateHero");
const GuideDescriptor2PlayerHero_1 = require("../models/GuideDescriptor2PlayerHero");
const GuideDescriptor2EnemyHero_1 = require("../models/GuideDescriptor2EnemyHero");
const HeroId_1 = __importDefault(require("../../data/HeroId"));
const GuideDescriptorQuickie_1 = __importDefault(require("../../data/dto/GuideDescriptorQuickie"));
const content_hash_service_1 = require("../../services/content-hash.service");
exports.default = async (moduleRef) => {
    const contentHashService = moduleRef.get(content_hash_service_1.ContentHashService);
    const dto1 = new GuideDescriptorQuickie_1.default({
        teammateHeroes: [HeroId_1.default.Ashe, HeroId_1.default.Baptiste],
        playerHeroes: [HeroId_1.default.Baptiste],
        enemyHeroes: [HeroId_1.default.Bastion, HeroId_1.default.Baptiste],
    });
    const dto2 = new GuideDescriptorQuickie_1.default({
        enemyHeroes: [HeroId_1.default.Dva],
    });
    await GuideDescriptor_1.GuideDescriptor.create({
        id: 1,
        contentHash: contentHashService.hash(dto1)
    });
    await GuideDescriptor_1.GuideDescriptor.create({
        id: 2,
        contentHash: contentHashService.hash(dto2)
    });
    await GuideDescriptor2TeammateHero_1.GuideDescriptor2TeammateHero.create({
        guideDescriptorId: 1,
        heroId: HeroId_1.default.Ashe
    });
    await GuideDescriptor2TeammateHero_1.GuideDescriptor2TeammateHero.create({
        guideDescriptorId: 1,
        heroId: HeroId_1.default.Baptiste
    });
    await GuideDescriptor2PlayerHero_1.GuideDescriptor2PlayerHero.create({
        guideDescriptorId: 1,
        heroId: HeroId_1.default.Baptiste
    });
    await GuideDescriptor2EnemyHero_1.GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId_1.default.Bastion
    });
    await GuideDescriptor2EnemyHero_1.GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId_1.default.Baptiste
    });
    await GuideDescriptor2EnemyHero_1.GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 2,
        heroId: HeroId_1.default.Dva
    });
};
//# sourceMappingURL=guide-descriptor.js.map