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
        singular: 'ThematicTag',
        plural: 'ThematicTags',
    }
})
export class ThematicTag extends Model<ThematicTag> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @Unique
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    name: string;

    @Unique
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(32)})
    dataName: string

}