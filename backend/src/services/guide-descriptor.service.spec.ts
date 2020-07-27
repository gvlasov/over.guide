import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes.json"
import guideDescriptorsFixture from "@fixtures/guide-descriptor.json"
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import HeroId from "data/HeroId";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import mapsFixture from "@fixtures/maps"
import thematicTagsFixture from "@fixtures/thematicTags"
import {ContentHashService} from "src/services/content-hash.service";

describe(
    GuideDescriptorService,
    nestTest(GuideDescriptorService, [], [ContentHashService], (ctx) => {
            it('finds by different hero categories', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = ctx.service.getExact({
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Dva],
                    playerHeroes: [],
                    thematicTags: [],
                })
                expect(descriptor).not.toBe(null)
            });
            it('gets descriptors by multiple categories', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                await ctx.service.getExact({
                    mapTags: [],
                    allyHeroes: [HeroId.Ashe, HeroId.Baptiste],
                    enemyHeroes: [HeroId.Baptiste, HeroId.Bastion],
                    playerHeroes: [HeroId.Baptiste],
                    thematicTags: [],
                })
                    .then(async descriptor => {
                        expect(descriptor).not.toBe(null)
                    })
            });
            it('doenst find non existent descriptors', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = await ctx.service.getExact({
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Zenyatta, HeroId.Zarya],
                    playerHeroes: [],
                    thematicTags: [],
                })
                expect(descriptor).toBe(null)
            });
            it('obtains existent descriptors without creating new', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const oldCount = (await GuideDescriptor.findAndCountAll()).count;
                await ctx.service.obtainExact({
                    mapTags: [],
                    allyHeroes: [HeroId.Ashe, HeroId.Baptiste],
                    enemyHeroes: [HeroId.Baptiste, HeroId.Bastion],
                    playerHeroes: [HeroId.Baptiste],
                    thematicTags: [],
                })
                    .then(async descriptor => {
                        expect(
                            (await GuideDescriptor.findAndCountAll()).count
                        ).toEqual(oldCount)
                    })
            });
            it('doesnt find if only subset of tags matches', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const oldCount = (await GuideDescriptor.findAndCountAll()).count;
                await ctx.service.getExact({
                    mapTags: [],
                    allyHeroes: [HeroId.Ashe, HeroId.Baptiste],
                    enemyHeroes: [HeroId.Baptiste /* no bastion */],
                    playerHeroes: [HeroId.Baptiste],
                    thematicTags: [],
                })
                    .then(async descriptor => {
                        expect(descriptor).toBe(null)
                        expect(oldCount).toBe(
                            (await GuideDescriptor.findAndCountAll()).count
                        );
                    })
            });
            it('creates new descriptor if not exists when obtaining', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const oldCount = (await GuideDescriptor.findAndCountAll()).count;
                await ctx.service.obtainExact({
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [],
                    playerHeroes: [HeroId.Zenyatta],
                    thematicTags: [],
                })
                    .then(async descriptor => {
                        expect(
                            (await GuideDescriptor.findAndCountAll()).count
                        ).toEqual(oldCount + 1)
                    })
            });
            it('creates every data point within descriptor', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                await ctx.service.obtainExact({
                    mapTags: [MapId.Eichenwalde, MapId.Havana],
                    allyHeroes: [HeroId.McCree],
                    enemyHeroes: [HeroId.WreckingBall],
                    playerHeroes: [HeroId.Zenyatta],
                    thematicTags: [GuideTheme.Psychology],
                })
                    .then(async descriptor => {
                        await descriptor.reload()
                        expect((await descriptor.$get('players')).length).toBe(1)
                        expect((await descriptor.$get('allies')).length).toBe(1)
                        expect((await descriptor.$get('enemies')).length).toBe(1)
                        expect((await descriptor.$get('maps')).length).toBe(2)
                        expect((await descriptor.$get('thematicTags')).length).toBe(1)
                    })
            });
            it('finds descriptor that include given tags', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                await ctx.service.obtainExact({
                    mapTags: [MapId.Eichenwalde, MapId.Havana],
                    allyHeroes: [HeroId.McCree],
                    enemyHeroes: [HeroId.WreckingBall],
                    playerHeroes: [HeroId.Zenyatta],
                    thematicTags: [GuideTheme.Psychology],
                })
                await ctx.service.obtainExact({
                    mapTags: [MapId.Eichenwalde],
                    allyHeroes: [],
                    enemyHeroes: [],
                    playerHeroes: [],
                    thematicTags: [GuideTheme.Psychology],
                })
                await ctx.service.obtainExact({
                    mapTags: [MapId.Eichenwalde],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Soldier],
                    playerHeroes: [],
                    thematicTags: [GuideTheme.Psychology],
                })
                await ctx.service.obtainExact({
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Soldier],
                    playerHeroes: [],
                    thematicTags: [GuideTheme.Psychology],
                })
                await ctx.service.getIncluding({
                    playerHeroes: [],
                    mapTags: [MapId.Eichenwalde],
                    allyHeroes: [],
                    enemyHeroes: [],
                    thematicTags: [GuideTheme.Psychology],
                })
                    .then(descriptors => {
                        expect(descriptors.length).toBe(3)
                    })
                await ctx.service.getIncluding({
                    playerHeroes: [],
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Soldier],
                    thematicTags: [],
                })
                    .then(descriptors => {
                        expect(descriptors.length).toBe(2)
                    })
                await ctx.service.getIncluding({
                    playerHeroes: [],
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroId.Soldier, HeroId.Dva],
                    thematicTags: [],
                })
                    .then(descriptors => {
                        expect(descriptors.length).toBe(0)
                    })
                await ctx.service.getIncluding({
                    playerHeroes: [],
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [],
                    thematicTags: [],
                })
                    .then(descriptors => {
                        expect(descriptors.length).toBe(4)
                    })
            });
            it('fails when trying to obtain descriptor with no tags', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                expect(
                    () => {
                        return ctx.service.obtainExact({
                            mapTags: [],
                            allyHeroes: [],
                            enemyHeroes: [],
                            playerHeroes: [],
                            thematicTags: [],
                        })
                    }
                ).toThrow(`Can't obtain descriptor from empty DTO`)
            });
        }
    )
)
