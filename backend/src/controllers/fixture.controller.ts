import {Body, Controller, Delete, Post} from '@nestjs/common';
import {FixtureService} from "src/services/fixture.service";

@Controller('fixture')
export class FixtureController {

    constructor(
        private readonly service: FixtureService
    ) {
    }

    @Post()
    load(@Body() json: object[]) {
        this.service.loadFixture(json)
    }

    @Delete()
    clear() {
        this.service.truncateTables()
    }

}
