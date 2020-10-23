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
import RestrictionTypeId from "data/RestrictionTypeId";
import {Sentence} from "src/database/models/Sentence";
import RestrictionReadDto from "data/dto/RestrictionReadDto";

@Table
export class Restriction extends Model<Restriction> {

    private static uniqueKey = 'restriction_unique'

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Restriction.uniqueKey,
    })
    typeId: RestrictionTypeId

    @AllowNull(true)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Restriction.uniqueKey,
    })
    objectId: number

    @ForeignKey(() => Sentence)
    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Restriction.uniqueKey,
    })
    sentenceId: number

    @BelongsTo(() => Sentence, 'sentenceId')
    sentence: Sentence

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    start: Date

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    end: Date

    toDto(): RestrictionReadDto {
        return {
            id: this.id,
            typeId: this.typeId,
            objectId: this.objectId,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            sentenceId: this.sentenceId,
        }
    }

}