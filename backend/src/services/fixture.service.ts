import {Inject, Injectable} from '@nestjs/common';
import {loadFixtures} from "sequelize-fixtures";
import {SEQUELIZE} from "src/constants";
import {Sequelize} from "sequelize-typescript";

@Injectable()
export class FixtureService {
    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize
    ) {
    }

    async loadFixture(fixture: object[]): Promise<any> {
        // in sequelize-fixtures, a "fixture" is a single database record; here a "fixture" is a collection of database records, as in PHP world I used to work in
        console.log('loading fixture')
        return await loadFixtures(
            fixture,
            this.sequelize.models
        )
    }

    async loadFixtureClear(fixture: object[]) {
        this.truncateTables()
        return await this.loadFixture(fixture)
    }

    async loadFixturesClear(...fixtures: object[][]) {
        this.truncateTables()
        // https://dev.to/afifsohaili/dealing-with-promises-in-an-array-with-async-await-5d7g Ctrl+F "Wait for all promises to complete one-by-one"
        return await (fixtures.map(
                f => this.loadFixture(f).then(() => console.log('fixture loaded'))
            )
                .reduce(async (previousPromise, nextAsyncFunction) => {
                    await previousPromise;
                    await nextAsyncFunction;
                }, Promise.resolve())
        );
    }

    truncateTables() {
        Object.values(this.sequelize.models)
            .map(async model => {
                await this.sequelize.transaction((t) => {
                    var options = {raw: true, transaction: t}

                    return this.sequelize
                        .query(`
                        SET FOREIGN_KEY_CHECKS = 0;
                        TRUNCATE TABLE ${model.tableName};
                        SET FOREIGN_KEY_CHECKS = 1;
                        `, options)
                })
            });
    }

}
