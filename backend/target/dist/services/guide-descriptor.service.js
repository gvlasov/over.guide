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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GuideDescriptorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideDescriptorService = void 0;
const common_1 = require("@nestjs/common");
const GuideDescriptor_1 = require("../database/models/GuideDescriptor");
const GuideDescriptorDto_1 = __importStar(require("../data/dto/GuideDescriptorDto"));
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const sequelize_1 = require("sequelize");
const GuideDescriptor2PlayerHero_1 = require("../database/models/GuideDescriptor2PlayerHero");
const GuideDescriptor2TeammateHero_1 = require("../database/models/GuideDescriptor2TeammateHero");
const GuideDescriptor2EnemyHero_1 = require("../database/models/GuideDescriptor2EnemyHero");
const GuideDescriptor2ThematicTag_1 = require("../database/models/GuideDescriptor2ThematicTag");
const GuideDescriptor2Map_1 = require("../database/models/GuideDescriptor2Map");
const content_hash_service_1 = require("./content-hash.service");
const GuideDescriptor2PlayerAbility_1 = require("../database/models/GuideDescriptor2PlayerAbility");
const GuideDescriptor2TeammateAbility_1 = require("../database/models/GuideDescriptor2TeammateAbility");
const GuideDescriptor2EnemyAbility_1 = require("../database/models/GuideDescriptor2EnemyAbility");
const EmptyDescriptorException_1 = __importDefault(require("./EmptyDescriptorException"));
const ImpossibleDescriptorError_1 = __importDefault(require("./ImpossibleDescriptorError"));
const HeroId_1 = __importDefault(require("../data/HeroId"));
const AbilityId_1 = __importDefault(require("../data/AbilityId"));
const abilities_1 = __importDefault(require("../data/abilities"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
let GuideDescriptorService = GuideDescriptorService_1 = class GuideDescriptorService {
    constructor(sequelize, contentHashService) {
        this.sequelize = sequelize;
        this.contentHashService = contentHashService;
    }
    isEmpty(dto) {
        return (dto.thematicTags.length +
            dto.mapTags.length +
            dto.playerHeroes.length +
            dto.playerAbilities.length +
            dto.teammateHeroes.length +
            dto.teammateAbilities.length +
            dto.enemyHeroes.length +
            dto.enemyAbilities.length === 0);
    }
    async getExact(dto) {
        return this.buildQuery(dto, true)
            .then(descriptors => {
            if (descriptors.length > 1) {
                throw new Error('Multiple descriptors found for DTO:\n' + JSON.stringify(dto));
            }
            else if (descriptors.length === 0) {
                return null;
            }
            else {
                return descriptors[0];
            }
        });
    }
    async getIncluding(dto) {
        return this.buildQuery(dto, false);
    }
    buildQuery(dto, exact) {
        const parts = [
            ['mapTags', 'Map', 'mapId'],
            ['thematicTags', 'ThematicTag', 'thematicTagId'],
            ['playerHeroes', 'PlayerHero', 'heroId'],
            ['playerAbilities', 'PlayerAbility', 'abilityId'],
            ['teammateHeroes', 'TeammateHero', 'heroId'],
            ['teammateAbilities', 'TeammateAbility', 'abilityId'],
            ['enemyHeroes', 'EnemyHero', 'heroId'],
            ['enemyAbilities', 'EnemyAbility', 'abilityId'],
        ].map(item => {
            const [partName, tableSuffix, pivotTableFieldName] = item;
            return GuideDescriptorService_1.buildQueryPart(dto, partName, tableSuffix, pivotTableFieldName, exact);
        })
            .filter(part => part !== null);
        return this.sequelize.query((parts.length === 0) ?
            `select *
                     from GuideDescriptor`
            :
                `
                    select *
                    from GuideDescriptor
                    where 
                        ${parts
                    .map(part => `id in (${part})`)
                    .join(` and `)}
            `, {
            type: sequelize_1.QueryTypes.SELECT,
            model: GuideDescriptor_1.GuideDescriptor,
            replacements: {
                mapTags: dto.mapTags,
                thematicTags: dto.thematicTags,
                playerHeroes: dto.playerHeroes,
                playerAbilities: dto.playerAbilities,
                teammateHeroes: dto.teammateHeroes,
                teammateAbilities: dto.teammateAbilities,
                enemyHeroes: dto.enemyHeroes,
                enemyAbilities: dto.enemyAbilities,
            }
        });
    }
    obtainExact(guideDescriptorDto) {
        if (this.isEmpty(guideDescriptorDto)) {
            throw new EmptyDescriptorException_1.default(`Can't obtain descriptor from empty DTO`);
        }
        GuideDescriptorService_1.validateAbilitiesCorrespondToHeroes(guideDescriptorDto.playerHeroes, guideDescriptorDto.playerAbilities);
        GuideDescriptorService_1.validateAbilitiesCorrespondToHeroes(guideDescriptorDto.teammateHeroes, guideDescriptorDto.teammateAbilities);
        GuideDescriptorService_1.validateAbilitiesCorrespondToHeroes(guideDescriptorDto.enemyHeroes, guideDescriptorDto.enemyAbilities);
        GuideDescriptorService_1.validateAbilitiesNumber(guideDescriptorDto);
        return this.getExact(guideDescriptorDto)
            .then(async (oldDescriptor) => {
            let result;
            if (oldDescriptor === null) {
                const newDescriptor = await GuideDescriptor_1.GuideDescriptor.create({
                    contentHash: this.contentHashService.hash(guideDescriptorDto)
                });
                for (const heroId of guideDescriptorDto.playerHeroes) {
                    await GuideDescriptor2PlayerHero_1.GuideDescriptor2PlayerHero.create({
                        guideDescriptorId: newDescriptor.id,
                        heroId: heroId,
                    });
                }
                for (const abilityId of guideDescriptorDto.playerAbilities) {
                    await GuideDescriptor2PlayerAbility_1.GuideDescriptor2PlayerAbility.create({
                        guideDescriptorId: newDescriptor.id,
                        abilityId: abilityId,
                    });
                }
                for (const heroId of guideDescriptorDto.teammateHeroes) {
                    await GuideDescriptor2TeammateHero_1.GuideDescriptor2TeammateHero.create({
                        guideDescriptorId: newDescriptor.id,
                        heroId: heroId,
                    });
                }
                for (const abilityId of guideDescriptorDto.teammateAbilities) {
                    await GuideDescriptor2TeammateAbility_1.GuideDescriptor2TeammateAbility.create({
                        guideDescriptorId: newDescriptor.id,
                        abilityId: abilityId,
                    });
                }
                for (const heroId of guideDescriptorDto.enemyHeroes) {
                    await GuideDescriptor2EnemyHero_1.GuideDescriptor2EnemyHero.create({
                        guideDescriptorId: newDescriptor.id,
                        heroId: heroId,
                    });
                }
                for (const abilityId of guideDescriptorDto.enemyAbilities) {
                    await GuideDescriptor2EnemyAbility_1.GuideDescriptor2EnemyAbility.create({
                        guideDescriptorId: newDescriptor.id,
                        abilityId: abilityId,
                    });
                }
                for (const tagId of guideDescriptorDto.thematicTags) {
                    await GuideDescriptor2ThematicTag_1.GuideDescriptor2ThematicTag.create({
                        guideDescriptorId: newDescriptor.id,
                        thematicTagId: tagId,
                    });
                }
                for (const mapId of guideDescriptorDto.mapTags) {
                    await GuideDescriptor2Map_1.GuideDescriptor2Map.create({
                        guideDescriptorId: newDescriptor.id,
                        mapId: mapId,
                    });
                }
                result = newDescriptor;
            }
            else {
                result = oldDescriptor;
            }
            return result;
        });
    }
    static validateAbilitiesCorrespondToHeroes(heroes, abilities) {
        if (lodash_difference_1.default(lodash_uniq_1.default(abilities
            .map(a => abilities_1.default.get(a).heroId)), heroes)
            .length > 0) {
            throw new ImpossibleDescriptorError_1.default();
        }
    }
    static buildQueryPart(guideDescriptorDto, partName, tableSuffix, pivotTableFieldName, exact) {
        const pivotTableName = `GuideDescriptor2${tableSuffix}`;
        const items = guideDescriptorDto[partName];
        if (items.length === 0) {
            if (exact) {
                return `
            select GuideDescriptor.id as guideDescriptorId
            from GuideDescriptor
            left join ${pivotTableName}
            on ${pivotTableName}.guideDescriptorId = GuideDescriptor.id
where ${pivotTableName}.${pivotTableFieldName} is null
            `;
            }
            else {
                return null;
            }
        }
        else {
            if (exact) {
                return `
select guideDescriptorId
       from (
                select guideDescriptorId, tagCount, count(*) as matchCount
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as tagCount
                from ${pivotTableName}
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where tagCount = ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
           group by guideDescriptorId
) tbl_${partName}_intermediate_1
where tagCount = matchCount
           group by guideDescriptorId
            `;
            }
            else {
                return `
select distinct guideDescriptorId from (
                select guideDescriptorId
                       from (
                             select *,
                       count(*) over(partition by guideDescriptorId) as count
                from ${pivotTableName}
                           where ${pivotTableFieldName} in (:${partName})
                           ) tbl_${pivotTableName}_${pivotTableFieldName}
                where count >= ${items.length}
                  and ${pivotTableFieldName} in (:${partName})
) tbl_${partName}
            `;
            }
        }
    }
    static validateAbilitiesNumber(dto) {
        return dto.enemyAbilities.length + dto.playerAbilities.length + dto.teammateAbilities.length <= GuideDescriptorDto_1.MAX_DESCRIPTOR_TOTAL_ABILITY_COUNT;
    }
};
GuideDescriptorService = GuideDescriptorService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        content_hash_service_1.ContentHashService])
], GuideDescriptorService);
exports.GuideDescriptorService = GuideDescriptorService;
//# sourceMappingURL=guide-descriptor.service.js.map