import {
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

    @Unique
    @Column({type: new DataTypes.STRING(32)})
    name: string;

    @Column({
        type: new DataTypes.INTEGER()
    })
    type: number

    @Unique
    @Column({type: new DataTypes.STRING(32)})
    dataName: string

}