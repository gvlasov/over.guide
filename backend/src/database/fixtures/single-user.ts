import {User} from "src/database/models/User";

export default async (moduleRef) => {
    await User.create({
        name: 'testuser#123',
        battleNetUserId: '123412341234',
        banned: 0,
    })
}