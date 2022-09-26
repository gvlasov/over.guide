import { User } from "src/database/models/User";
import NotificationTypeId from "data/NotificationTypeId";
import { Notification } from "src/database/models/Notification";
import { OnlineUsersRepository } from "src/services/online-users.repository";
export declare class NotificationService {
    private readonly onlineUsersRepository;
    private static NEW_NOTIFICATION_EVENT_NAME;
    constructor(onlineUsersRepository: OnlineUsersRepository);
    notify(user: User, notificationTypeId: NotificationTypeId, notification: any, read?: boolean): Promise<Notification>;
}
