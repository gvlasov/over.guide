import NotificationReadDto from "data/dto/NotificationReadDto";
import FeedPortionDto from "data/dto/FeedPortionDto";
export default interface NotificationsPageDto extends FeedPortionDto<NotificationReadDto> {
    readonly totalUnread: number;
}
