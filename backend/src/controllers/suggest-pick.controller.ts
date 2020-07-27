import {Body, Controller, Post} from '@nestjs/common';
import {SuggestPickService} from "src/services/suggest-pick.service";
import PickContextDto from "data/dto/PickContextDto";

@Controller('suggest-pick')
export class SuggestPickController {

    constructor(
        private readonly service: SuggestPickService
    ) {

    }

    @Post()
    evaluate(@Body() context: PickContextDto) {
        return this.service.suggestPick(context)
    }
}
