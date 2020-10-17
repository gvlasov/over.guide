import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {Fixture, FixtureService} from "src/services/fixture.service";
import heroesFixture from '@fixtures/heroes'
import mapsFixture from '@fixtures/maps'
import thematicTagsFixture from '@fixtures/thematicTags'
import guideTestingFixture from '@fixtures/guideTesting'
import reportsFixture from '@fixtures/reportsFixture'
import abilitiesFixture from '@fixtures/abilities'
import commentsFixture from "@fixtures/commentsFixture";

@Controller('fixture')
export class FixtureController {

    constructor(
        private readonly service: FixtureService
    ) {
    }

    @Post()
    load(@Body() json: Fixture) {
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
            abilitiesFixture,
            thematicTagsFixture,
            guideTestingFixture,
            commentsFixture,
            reportsFixture,
        )
    }

}
