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
import EntityTypeId from "data/EntityTypeId";
import {User} from "src/database/models/User";

@Table
export class Comment extends Model<Comment> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    parentId: number

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    parentType: EntityTypeId

    @AllowNull(false)
    @Column({type: new DataTypes.TEXT()})
    content: string

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    authorId: number

    @BelongsTo(() => User, 'authorId')
    author: User

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    createdAt: Date

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    updatedAt: Date

    @AllowNull(true)
    @Column({type: new DataTypes.DATE()})
    deactivatedAt: Date

    @AllowNull(true)
    @ForeignKey(() => User)
    @Column
    deactivatedById: number

}