"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
exports.default = async (moduleRef) => {
    await User_1.User.create({
        name: 'testuser#123',
        battleNetUserId: '123412341234',
        banned: 0,
    });
};
//# sourceMappingURL=single-user.js.map