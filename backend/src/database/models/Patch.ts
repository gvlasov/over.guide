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

    @Unique({name: 'version', msg: ''})
    @AllowNull(false)
    @Column
    version: string;

    @Unique({name: 'date', msg: ''})
    @AllowNull(false)
    @Column
    date: Date

    @Unique({name: 'title', msg: ''})
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(30)})
    title: string
}