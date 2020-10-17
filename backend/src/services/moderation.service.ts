import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";

@Injectable()
export class ModerationService {

    isModerator(user: User): boolean {
        return user.name.indexOf('ojman') > -1
    }

}
