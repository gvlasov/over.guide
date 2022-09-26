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
var ReportSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSearchService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const ReportQueryDto_1 = __importDefault(require("../data/dto/ReportQueryDto"));
const Report_1 = require("../database/models/Report");
const User_1 = require("../database/models/User");
const ReportPageDto_1 = __importDefault(require("../data/dto/ReportPageDto"));
let ReportSearchService = ReportSearchService_1 = class ReportSearchService {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async search(query) {
        const nextReports = await Report_1.Report.scope(['defaultScope', 'withContent']).findAll({
            subQuery: false,
            include: [
                {
                    model: User_1.User,
                    as: 'reporter',
                }
            ],
            where: {
                id: {
                    [sequelize_1.Op.notIn]: query.clientAlreadyHasReportIds,
                },
                handled: 0,
            },
            limit: ReportSearchService_1.pageSize + 1,
            order: [['createdAt', 'DESC']]
        });
        return {
            items: nextReports
                .slice(0, ReportSearchService_1.pageSize)
                .map(report => report.toDto()),
            hasNextPage: nextReports.length > ReportSearchService_1.pageSize,
        };
    }
};
ReportSearchService.pageSize = 10;
ReportSearchService = ReportSearchService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], ReportSearchService);
exports.ReportSearchService = ReportSearchService;
//# sourceMappingURL=report-search.service.js.map