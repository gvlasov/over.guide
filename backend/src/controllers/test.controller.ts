import {Body, Controller, Get} from '@nestjs/common';
import PickContextDto from "data/dto/PickContextDto";
import {TokenService} from "src/services/token.service";

@Controller('test')
export class TestController {

    constructor(
        private readonly service: TokenService
    ) {

    }

    @Get()
    test(@Body() context: PickContextDto) {
        return 'hello'
    }
}
