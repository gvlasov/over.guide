import FeedVso from "@/ts/vso/FeedVso";
import NotificationReadDto from "data/dto/NotificationReadDto";
import NotificationsPageDto from "data/dto/NotificationsPageDto";
import Socket = SocketIOClient.Socket;

export default class NotificationFeedVso extends FeedVso<NotificationReadDto, NotificationReadDto, NotificationsPageDto> {


    constructor(private readonly socket: Socket) {
        super();
    }

    dto2Vso(dto: NotificationReadDto): NotificationReadDto {
        return dto
    }

    vsoId(vso: NotificationReadDto): number {
        return vso.id
    }

    get unreadNotifications(): NotificationReadDto[] {
        return this.items.filter(report => !report.read)
    }

    get totalUnread(): number {
        return this.lastPage!.totalUnread
    }

    get feed(): (ids: number[]) => Promise<NotificationsPageDto> {
        return (ids: number[]) =>
            new Promise((resolve, reject) => {
                this.socket.emit('show-more', ids, (data: NotificationsPageDto) => {
                    resolve(data)
                })
            })
    }

}
