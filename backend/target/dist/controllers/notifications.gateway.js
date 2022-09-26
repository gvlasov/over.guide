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
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const token_service_1 = require("../services/token.service");
const online_users_repository_1 = require("../services/online-users.repository");
const Notification_1 = require("../database/models/Notification");
const sequelize_1 = require("sequelize");
const NotificationsPageDto_1 = __importDefault(require("../data/dto/NotificationsPageDto"));
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
let NotificationsGateway = class NotificationsGateway {
    constructor(tokenService, onlineUsersRepository, sequelize) {
        this.tokenService = tokenService;
        this.onlineUsersRepository = onlineUsersRepository;
        this.sequelize = sequelize;
    }
    async auth(client, token) {
        return this.tokenService.getUser(token)
            .then(user => {
            if (user === null) {
                return false;
            }
            else {
                this.onlineUsersRepository.saveClient(token, client);
                return true;
            }
        });
    }
    async showMore(client, clientAlreadyHasIds) {
        const user = await this.onlineUsersRepository.getUser(client);
        const countPerPage = 10;
        return Notification_1.Notification.findAll({
            where: {
                userId: user.id,
                id: {
                    [sequelize_1.Op.notIn]: clientAlreadyHasIds,
                },
            },
            limit: countPerPage + 1,
            order: [['read', 'ASC'], ['id', 'DESC']],
        })
            .then(async (notifications) => {
            return {
                items: notifications.slice(0, countPerPage).map(n => n.toDto()),
                hasNextPage: notifications.length === countPerPage + 1,
                totalUnread: await this.sequelize.query(`
select count(*) as cnt from Notification
where userId = ${user.id}
and \`read\` = 0
`)
                    .then((result) => {
                    return result[0][0].cnt;
                })
            };
        });
    }
    handleDisconnect(client) {
        this.onlineUsersRepository.removeClient(client);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsGateway.prototype, "auth", null);
__decorate([
    websockets_1.SubscribeMessage('show-more'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], NotificationsGateway.prototype, "showMore", null);
NotificationsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(2, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        online_users_repository_1.OnlineUsersRepository,
        sequelize_typescript_1.Sequelize])
], NotificationsGateway);
exports.NotificationsGateway = NotificationsGateway;
//# sourceMappingURL=notifications.gateway.js.map