import {
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
    @Column
    public id: number

    @Unique
    @Column({type: new DataTypes.STRING(32)})
    name: string

    @Unique
    @Column({type: new DataTypes.STRING(32)})
    dataName: string

    @ForeignKey(() => Hero)
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