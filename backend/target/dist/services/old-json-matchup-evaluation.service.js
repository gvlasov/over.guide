"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldJsonMatchupEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const HeroDto_1 = __importDefault(require("../data/dto/HeroDto"));
const counters_json_1 = __importDefault(require("../data/counters.json"));
let OldJsonMatchupEvaluationService = class OldJsonMatchupEvaluationService {
    evaluate(subject, object) {
        const find = counters_json_1.default.find(record => record[0] === subject.dataName && record[1] === object.dataName);
        return (find === undefined) ? 0 : this.extractScore(find[2]);
    }
    extractScore(scoreText) {
        if (scoreText === '--') {
            return -8;
        }
        else if (scoreText === '-') {
            return -4;
        }
        else if (scoreText === '+') {
            return 4;
        }
        else if (scoreText === '++') {
            return 8;
        }
    }
};
OldJsonMatchupEvaluationService = __decorate([
    common_1.Injectable()
], OldJsonMatchupEvaluationService);
exports.OldJsonMatchupEvaluationService = OldJsonMatchupEvaluationService;
//# sourceMappingURL=old-json-matchup-evaluation.service.js.map