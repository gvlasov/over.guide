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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureController = void 0;
const common_1 = require("@nestjs/common");
const fixture_service_1 = require("../services/fixture.service");
const heroes_1 = __importDefault(require("../database/fixtures/heroes"));
const maps_1 = __importDefault(require("../database/fixtures/maps"));
const thematicTags_1 = __importDefault(require("../database/fixtures/thematicTags"));
const regular_guide_testing_1 = __importDefault(require("../database/fixtures/regular-guide-testing"));
const huge_guide_testing_1 = __importDefault(require("../database/fixtures/huge-guide-testing"));
const reportsFixture_1 = __importDefault(require("../database/fixtures/reportsFixture"));
const abilities_1 = __importDefault(require("../database/fixtures/abilities"));
const commentsFixture_1 = __importDefault(require("../database/fixtures/commentsFixture"));
const patchFixture_1 = __importDefault(require("../database/fixtures/patchFixture"));
let FixtureController = class FixtureController {
    constructor(service) {
        this.service = service;
    }
    load(json) {
        this.service.loadFixture(json);
    }
    clear() {
        this.service.truncateTables();
    }
    loadDefault() {
        this.service.loadFixturesClear(patchFixture_1.default, heroes_1.default, maps_1.default, abilities_1.default, thematicTags_1.default, regular_guide_testing_1.default, commentsFixture_1.default, reportsFixture_1.default);
    }
    loadHuge() {
        this.service.loadFixturesClear(patchFixture_1.default, heroes_1.default, maps_1.default, abilities_1.default, thematicTags_1.default, huge_guide_testing_1.default, commentsFixture_1.default, reportsFixture_1.default);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], FixtureController.prototype, "load", null);
__decorate([
    common_1.Delete(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FixtureController.prototype, "clear", null);
__decorate([
    common_1.Get('load-default'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FixtureController.prototype, "loadDefault", null);
__decorate([
    common_1.Get('load-huge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FixtureController.prototype, "loadHuge", null);
FixtureController = __decorate([
    common_1.Controller('fixture'),
    __metadata("design:paramtypes", [fixture_service_1.FixtureService])
], FixtureController);
exports.FixtureController = FixtureController;
//# sourceMappingURL=fixture.controller.js.map