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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
const Notification_1 = require("../database/models/Notification");
let NotificationController = class NotificationController {
    constructor(sequelize, authService) {
        this.sequelize = sequelize;
        this.authService = authService;
    }
    async markRead(request, notificationIds) {
        const user = await this.authService.getUser(request);
        await Notification_1.Notification.update({
            read: true,
        }, {
            where: {
                id: notificationIds,
                userId: user.id,
                read: false,
            },
        });
    }
    async markAllRead(request) {
        const user = await this.authService.getUser(request);
        await Notification_1.Notification.update({
            read: true,
        }, {
            where: {
                userId: user.id,
                read: false,
            },
        });
    }
};
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Post('mark-read'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markRead", null);
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Post('mark-all-read'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllRead", null);
NotificationController = __decorate([
    common_1.Controller('notifications'),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        auth_service_1.AuthService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map