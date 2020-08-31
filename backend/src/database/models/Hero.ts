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
import Role from "data/Role"

@Table({
    name: {
        singular: 'Hero',
        plural: 'Heroes',
    },
    createdAt: false,
    updatedAt: false
})
export class Hero extends Model<Hero> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @Unique
    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @AllowNull(false)
    @Unique
    @Column({type: new DataTypes.STRING(20)})
    dataName: string

    @Column
    role: Role
}