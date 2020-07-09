import {Body, Controller, Get} from '@nestjs/common';
import PickContext from "src/data/dto/PickContext";
import {TokenService} from "src/services/token.service";

@Controller('test')
export class TestController {

    constructor(
        private readonly service: TokenService
    ) {

    }

    @Get()
    test(@Body() context: PickContext) {
        return 'hello'
    }
}
