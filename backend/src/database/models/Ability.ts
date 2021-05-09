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
import {Patch} from "./Patch";
import {Hero} from "./Hero";

@Table
export class Ability extends Model<Ability> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @Unique({name: 'name', msg: ''})
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    name: string

    @Unique({name: 'dataName', msg: ''})
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    dataName: string

    @ForeignKey(() => Hero)
    @AllowNull(false)
    @Column
    heroId: number

    @BelongsTo(() => Hero, 'heroId')
    hero: Hero

    @ForeignKey(() => Patch)
    @Column
    removedAtPatchId: number

    @BelongsTo(() => Patch, 'removedAtPatchId')
    removedAtPatch: Patch

}