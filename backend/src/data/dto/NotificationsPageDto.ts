import NotificationReadDto from "data/dto/NotificationReadDto";

export default interface NotificationsPageDto {
    readonly notifications: NotificationReadDto[]
    readonly hasNextPage: boolean
    readonly totalUnread: number
}
