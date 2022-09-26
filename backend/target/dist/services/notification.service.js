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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../database/models/User");
const NotificationTypeId_1 = __importDefault(require("../data/NotificationTypeId"));
const Notification_1 = require("../database/models/Notification");
const online_users_repository_1 = require("./online-users.repository");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(onlineUsersRepository) {
        this.onlineUsersRepository = onlineUsersRepository;
    }
    async notify(user, notificationTypeId, notification, read = false) {
        return Notification_1.Notification.create({
            userId: user.id,
            notificationTypeId: notificationTypeId,
            json: JSON.stringify(notification),
            read: read ? 1 : 0,
        })
            .then(notification => {
            this.onlineUsersRepository.getClient(user).emit(NotificationService_1.NEW_NOTIFICATION_EVENT_NAME, notification.toDto());
            return notification;
        });
    }
};
NotificationService.NEW_NOTIFICATION_EVENT_NAME = 'new';
NotificationService = NotificationService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [online_users_repository_1.OnlineUsersRepository])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map