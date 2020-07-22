import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes.json"
import guideDescriptorsFixture from "@fixtures/guide-descriptor.json"
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import HeroIds from "data/HeroIds";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import Map from "data/Map";
import GuideTheme from "data/GuideTheme";
import mapsFixture from "@fixtures/maps"
import thematicTagsFixture from "@fixtures/thematicTags"

describe(
    GuideDescriptorService,
    nestTest(GuideDescriptorService, [], [], (ctx) => {
            it('finds by different hero categories', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = ctx.service.getExact({
                    mapTags: [],
                    allyHeroes: [],
                    enemyHeroes: [HeroIds.Dva],
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
                    allyHeroes: [HeroIds.Ashe, HeroIds.Baptiste],
                    enemyHeroes: [HeroIds.Baptiste, HeroIds.Bastion],
                    playerHeroes: [HeroIds.Baptiste],
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
                    enemyHeroes: [HeroIds.Zenyatta, HeroIds.Zarya],
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
                    allyHeroes: [HeroIds.Ashe, HeroIds.Baptiste],
                    enemyHeroes: [HeroIds.Baptiste, HeroIds.Bastion],
                    playerHeroes: [HeroIds.Baptiste],
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
                    allyHeroes: [HeroIds.Ashe, HeroIds.Baptiste],
                    enemyHeroes: [HeroIds.Baptiste /* no bastion */],
                    playerHeroes: [HeroIds.Baptiste],
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
                    playerHeroes: [HeroIds.Zenyatta],
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
                    mapTags: [Map.Eichenwalde, Map.Havana],
                    allyHeroes: [HeroIds.McCree],
                    enemyHeroes: [HeroIds.WreckingBall],
                    playerHeroes: [HeroIds.Zenyatta],
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
        }
    )
)
