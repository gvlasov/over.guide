import {
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
    @Column
    version: string;

    @Unique
    @Column
    date: Date

    @Unique
    @Column({type: new DataTypes.STRING(30)})
    title: string
}