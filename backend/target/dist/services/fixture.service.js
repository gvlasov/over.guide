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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureService = exports.ActuallyNotTableButView = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
const core_1 = require("@nestjs/core");
function ActuallyNotTableButView(constructor) {
    constructor.__onlyView = true;
    constructor.sync = () => Promise.resolve();
    constructor.truncate = () => Promise.resolve();
}
exports.ActuallyNotTableButView = ActuallyNotTableButView;
function isOnlyView(model) {
    return typeof model.__onlyView !== 'undefined';
}
let FixtureService = class FixtureService {
    constructor(sequelize, moduleRef) {
        this.sequelize = sequelize;
        this.moduleRef = moduleRef;
    }
    async loadFixture(fixture) {
        if (fixture instanceof Function) {
            return fixture(this.moduleRef);
        }
        else {
            throw new Error('Fixture must be function');
        }
    }
    async loadFixtureClear(fixture) {
        this.truncateTables();
        return await this.loadFixture(fixture);
    }
    async loadFixturesClear(...fixtures) {
        this.truncateTables();
        return await (fixtures.map(f => (() => this.loadFixture(f)))
            .reduce(async (previousPromise, nextAsyncFunction) => {
            await previousPromise;
            await nextAsyncFunction();
        }, Promise.resolve()));
    }
    truncateTables() {
        Object.values(this.sequelize.models)
            .filter(model => !isOnlyView(model)
            && model.name !== 'SequelizeMeta')
            .map(async (model) => {
            await this.sequelize.transaction((t) => {
                var options = { raw: true, transaction: t };
                return this.sequelize
                    .query(`
                        SET FOREIGN_KEY_CHECKS = 0;
                        TRUNCATE TABLE ${model.tableName};
                        SET FOREIGN_KEY_CHECKS = 1;
                        `, options);
            });
        });
    }
};
FixtureService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        core_1.ModuleRef])
], FixtureService);
exports.FixtureService = FixtureService;
//# sourceMappingURL=fixture.service.js.map