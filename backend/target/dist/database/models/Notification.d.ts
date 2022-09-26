import { Model } from 'sequelize-typescript';
import NotificationTypeId from "data/NotificationTypeId";
import NotificationReadDto from "data/dto/NotificationReadDto";
export declare class Notification extends Model<Notification> {
    id: number;
    userId: number;
    notificationTypeId: NotificationTypeId;
    json: string;
    read: boolean;
    toDto(): NotificationReadDto;
}
