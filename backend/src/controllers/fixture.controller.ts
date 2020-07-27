import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {FixtureService} from "src/services/fixture.service";
import heroesFixture from '@fixtures/heroes'
import mapsFixture from '@fixtures/maps'
import thematicTagsFixture from '@fixtures/thematicTags'
import guideTestingFixture from '@fixtures/guideTesting'

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

    @Get('load-default')
    loadDefault() {
        this.service.loadFixturesClear(
            heroesFixture,
            mapsFixture,
            thematicTagsFixture,
            guideTestingFixture
        )
    }

}
