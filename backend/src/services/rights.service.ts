import {Injectable} from '@nestjs/common';
import {User} from "src/database/models/User";

@Injectable()
export class RightsService {

    canReport(user: User): boolean {
        return true
    }

}
