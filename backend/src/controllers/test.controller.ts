import {Body, Controller, Get} from '@nestjs/common';
import PickContext from "src/data/dto/PickContext";
import {TokenService} from "src/services/token.service";
import {User} from "src/database/models/User";

@Controller('test')
export class TestController {

    constructor(
        private readonly service: TokenService
    ) {

    }

    @Get()
    test(@Body() context: PickContext) {
        return User.findOne()
            .then(user => this.service.getToken(user))
    }
}
