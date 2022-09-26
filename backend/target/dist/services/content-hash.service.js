"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentHashService = void 0;
const common_1 = require("@nestjs/common");
let ContentHashService = class ContentHashService {
    constructor() {
        this.crypto = require('crypto');
    }
    hash(contentCarrier, strip = () => {
    }) {
        const carrierCopy = Object.assign({}, contentCarrier);
        strip(carrierCopy);
        return this.crypto.createHash('sha1').update(JSON.stringify(carrierCopy)).digest('base64');
    }
};
ContentHashService = __decorate([
    common_1.Injectable()
], ContentHashService);
exports.ContentHashService = ContentHashService;
//# sourceMappingURL=content-hash.service.js.map