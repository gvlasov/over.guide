import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table
export class Patch extends Model<Patch> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @Unique
    @AllowNull(false)
    @Column
    version: string;

    @Unique
    @AllowNull(false)
    @Column
    date: Date

    @Unique
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(30)})
    title: string
}