import {
    AllowNull,
    AutoIncrement,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "src/database/models/User";
import NotificationTypeId from "data/NotificationTypeId";
import NotificationReadDto from "data/dto/NotificationReadDto";

@Table({
    updatedAt: false,
    deletedAt: false,
})
export class Notification extends Model<Notification> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({type: new DataTypes.INTEGER()})
    userId: number

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    notificationTypeId: NotificationTypeId

    @AllowNull(false)
    @Column({type: new DataTypes.TEXT()})
    json: string

    @AllowNull(false)
    @Column({
        type: new DataTypes.TINYINT({
            unsigned: true,
            length: 1,
        }),
        defaultValue: false
    })
    read: boolean

    toDto() : NotificationReadDto {
        return {
            id: this.id,
            notificationTypeId: this.notificationTypeId,
            json: JSON.parse(this.json),
            createdAt: this.createdAt,
            read: this.read,
        }
    }

}