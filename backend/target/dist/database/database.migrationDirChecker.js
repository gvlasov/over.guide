"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMigrationDir = void 0;
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
function checkMigrationDir(dir, migrationsPattern) {
    if (fs_jetpack_1.default.list(dir).filter(filepath => migrationsPattern.test(filepath)).length === 0) {
        throw new Error('No migration scripts present in directory ' + dir);
    }
}
exports.checkMigrationDir = checkMigrationDir;
//# sourceMappingURL=database.migrationDirChecker.js.map