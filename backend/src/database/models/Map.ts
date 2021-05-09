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

@Table({
    name: {
        singular: 'Map',
        plural: 'Maps',
    }
})
export class Map extends Model<Map> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @Unique({name: 'name', msg: ''})
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    name: string;

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    type: number

    @Unique({name: 'dataName', msg: ''})
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    dataName: string

}