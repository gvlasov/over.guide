"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Patch_1 = require("../models/Patch");
exports.default = async (moduleRef) => {
    await Patch_1.Patch.create({
        version: '1.3.21',
        date: new Date('2020-01-01 12:00:00'),
        title: 'The Patch',
    });
};
//# sourceMappingURL=patchFixture.js.map