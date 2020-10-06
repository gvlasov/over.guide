import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "src/database/models/User";
import PostTypeId from "data/PostTypeId";

@Table({
    createdAt: false,
    updatedAt: false,
})
export class Vote extends Model<Vote> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    private static readonly uniqueKeyName = 'vote_unique';

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Vote.uniqueKeyName,
    })
    postId: number

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Vote.uniqueKeyName,
    })
    postTypeId: PostTypeId

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        unique: Vote.uniqueKeyName,
    })
    upvoterId: number

    @BelongsTo(() => User, 'upvoterId')
    upvoter: User

}