import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";
import NotificationTypeId from "data/NotificationTypeId";
import {Notification} from "src/database/models/Notification";
import {OnlineUsersRepository} from "src/services/online-users.repository";

@Injectable()
export class NotificationService {

    private static NEW_NOTIFICATION_EVENT_NAME = 'new'

    constructor(private readonly onlineUsersRepository: OnlineUsersRepository) {
    }

    async notify(
        user: User,
        notificationTypeId: NotificationTypeId,
        notification: any,
        read: boolean = false
    ): Promise<Notification> {
         return Notification.create({
            userId: user.id,
            notificationTypeId: notificationTypeId,
            json: JSON.stringify(notification),
            read: read ? 1 : 0,
        })
             .then(notification => {
                 this.onlineUsersRepository.getClient(user).emit(
                     NotificationService.NEW_NOTIFICATION_EVENT_NAME,
                     notification.toDto()
                 )
                 return notification
             })
    }

}
