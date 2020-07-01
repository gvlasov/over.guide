import {Body, Controller, Post} from '@nestjs/common';
import {SuggestPickService} from "src/services/suggest-pick.service";
import PickContext from "src/data/dto/PickContext";

@Controller('suggest-pick')
export class SuggestPickController {

    constructor(
        private readonly service: SuggestPickService
    ) {

    }

    @Post()
    evaluate(@Body() context: PickContext) {
        return this.service.suggestPick(context)
    }
}
