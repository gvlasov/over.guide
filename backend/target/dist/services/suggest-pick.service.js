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
var SuggestPickService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestPickService = void 0;
const common_1 = require("@nestjs/common");
const HeroDto_1 = __importDefault(require("../data/dto/HeroDto"));
const PickContextDto_1 = __importDefault(require("../data/dto/PickContextDto"));
const AlternativeDto_1 = __importDefault(require("../data/dto/AlternativeDto"));
const heroes_1 = __importDefault(require("../data/heroes"));
const Role_1 = __importDefault(require("../data/Role"));
const old_json_matchup_evaluation_service_1 = require("./old-json-matchup-evaluation.service");
const lodash_sum_1 = __importDefault(require("lodash.sum"));
let SuggestPickService = SuggestPickService_1 = class SuggestPickService {
    constructor(evaluation) {
        this.evaluation = evaluation;
    }
    suggestPick(context) {
        const teammateHeroes = context.teammateComp.map(h => heroes_1.default.get(h));
        const enemyHeroes = context.enemyComp.map(h => heroes_1.default.get(h));
        const missingRole = SuggestPickService_1.getMissingRole(teammateHeroes);
        return Array.from(heroes_1.default.values())
            .filter(hero => hero.role === missingRole
            && !teammateHeroes.some(h => hero.dataName === h.dataName))
            .map(hero => [hero, this.pickScore(enemyHeroes, hero)])
            .sort((a, b) => a[1] - b[1])
            .map(hero2Score => ({
            heroId: hero2Score[0].id,
            score: hero2Score[1]
        }));
    }
    static getMissingRole(heroes) {
        let tanks = 0;
        let damage = 0;
        let support = 0;
        for (let hero of heroes) {
            if (hero === null) {
                continue;
            }
            if (hero.role === Role_1.default.Tank) {
                tanks++;
            }
            else if (hero.role === Role_1.default.Damage) {
                damage++;
            }
            else if (hero.role === Role_1.default.Support) {
                support++;
            }
        }
        if (tanks == 1) {
            if (damage != 2 || support != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes));
            }
            return Role_1.default.Tank;
        }
        else if (damage == 1) {
            if (tanks != 2 || support != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes));
            }
            return Role_1.default.Damage;
        }
        else if (support == 1) {
            if (tanks != 2 || damage != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes));
            }
            return Role_1.default.Support;
        }
        throw new Error("Wrong team comp: " + JSON.stringify(heroes));
    }
    pickScore(enemyHeroes, hero) {
        return lodash_sum_1.default(enemyHeroes
            .map(enemy => this.evaluation.evaluate(hero, enemy)));
    }
};
SuggestPickService = SuggestPickService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [old_json_matchup_evaluation_service_1.OldJsonMatchupEvaluationService])
], SuggestPickService);
exports.SuggestPickService = SuggestPickService;
//# sourceMappingURL=suggest-pick.service.js.map