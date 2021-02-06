import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {Fixture, FixtureService} from "src/services/fixture.service";
import heroesFixture from '@fixtures/heroes'
import mapsFixture from '@fixtures/maps'
import thematicTagsFixture from '@fixtures/thematicTags'
import regularGuideTestingFixture from '@fixtures/regular-guide-testing'
import hugeGuideTestingFixture from '@fixtures/huge-guide-testing'
import reportsFixture from '@fixtures/reportsFixture'
import abilitiesFixture from '@fixtures/abilities'
import commentsFixture from "@fixtures/commentsFixture";
import patchFixture from "@fixtures/patchFixture";

@Controller()
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
            patchFixture,
            heroesFixture,
            mapsFixture,
            abilitiesFixture,
            thematicTagsFixture,
            regularGuideTestingFixture,
            commentsFixture,
            reportsFixture,
        )
    }

    @Get('load-huge')
    loadHuge() {
        this.service.loadFixturesClear(
            patchFixture,
            heroesFixture,
            mapsFixture,
            abilitiesFixture,
            thematicTagsFixture,
            hugeGuideTestingFixture,
            commentsFixture,
            reportsFixture,
        )
    }

}
