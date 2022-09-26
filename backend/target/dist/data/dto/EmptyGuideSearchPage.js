"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuideSearchPageDto_1 = __importDefault(require("./GuideSearchPageDto"));
class EmptyGuideSearchPage {
    constructor() {
        this.hasNextPage = false;
        this.items = [];
    }
}
exports.default = EmptyGuideSearchPage;
//# sourceMappingURL=EmptyGuideSearchPage.js.map