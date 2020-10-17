import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Restriction} from "src/database/models/Restriction";
import {ImmediateAction} from "src/database/models/ImmediateAction";
import {User} from "src/database/models/User";

@Table
export class Sentence extends Model<Sentence> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    defenderId: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    judgeId: number

    @BelongsTo(() => User, 'defenderId')
    defender: User

    @BelongsTo(() => User, 'judgeId')
    judge: User

    @HasMany(() => Restriction, 'sentenceId')
    restrictions: Restriction[]

    @HasMany(() => ImmediateAction, 'sentenceId')
    immediateActions: ImmediateAction[]

    @AllowNull(true)
    @Column({type: new DataTypes.TEXT})
    judgeCommentary: string|null

}