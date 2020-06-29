import {Column, Model, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import Role from "../../data/Role"

@Table({
    name: {
        singular: 'Hero',
        plural: 'Heroes',
    }
})
export class Hero extends Model<Hero> {

    @PrimaryKey
    @Column
    public id: number

    @Unique
    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @Unique
    @Column({type: new DataTypes.STRING(20)})
    dataName: string

    @Column
    role: Role
}