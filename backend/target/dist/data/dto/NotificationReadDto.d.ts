import NotificationTypeId from "data/NotificationTypeId";
export default interface NotificationReadDto {
    readonly id: number;
    readonly notificationTypeId: NotificationTypeId;
    readonly json: any;
    readonly createdAt: string;
    read: boolean;
}
