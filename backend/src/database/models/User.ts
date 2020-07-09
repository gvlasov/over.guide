import {Column, Model, Table, Unique} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table({
    name: {
        singular: 'User',
        plural: 'Users',
    }
})
export class User extends Model<User> {

    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @Unique
    @Column({type: new DataTypes.STRING(15)})
    battleNetUserId: string
}