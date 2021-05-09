import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Sentence} from "src/database/models/Sentence";
import ImmediateActionTypeId from "data/ImmediateActionTypeId";

@Table({})
export class ImmediateAction extends Model<ImmediateAction> {

    private static uniqueKey = 'immediate_action_unique'

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(true)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: ImmediateAction.uniqueKey,
    })
    objectId: number

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: ImmediateAction.uniqueKey,
    })
    typeId: ImmediateActionTypeId

    @ForeignKey(() => Sentence)
    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: ImmediateAction.uniqueKey,
    })
    sentenceId: number

    @BelongsTo(() => Sentence, 'sentenceId')
    sentence: Sentence

}