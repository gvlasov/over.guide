import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import guideDescriptorsFixture from "@fixtures/guide-descriptor"
import GuideSearchCacheService from "src/services/guide-search-cache.service";
import singleUserFixture from "@fixtures/single-user";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import MapId from "data/MapId";
import HeroId from "data/HeroId";

describe(
    GuideSearchCacheService,
    nestTest(GuideSearchCacheService, (ctx) => {
            it('returns null for any query to empty cache', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                expect(ctx.service.getAll()).toBeNull()
                const descriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Bastion]
                });
                expect(ctx.service.get(descriptor)).toBeNull()
            });
            it('removes values from cache by exact descriptor', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Bastion]
                });
                ctx.service.set(descriptor, '123')
                expect(
                    ctx.service.get(descriptor)
                ).toBe('123')
                ctx.service.clear(descriptor)
                expect(
                    ctx.service.get(descriptor)
                ).toBeNull()
            });
            it('removes values from cache by subset descriptor', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Bastion, HeroId.Hanzo]
                });
                const subsetDescriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Hanzo]
                });
                ctx.service.set(descriptor, '123')
                expect(
                    ctx.service.get(descriptor)
                ).toBe('123')
                ctx.service.clear(subsetDescriptor)
                expect(
                    ctx.service.get(descriptor)
                ).toBeNull()
                expect(
                    ctx.service.get(subsetDescriptor)
                ).toBeNull()
            });
            it('doesnt remove values from cache by superset descriptor', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Hanzo]
                });
                const supersetDescriptor = new GuideDescriptorQuickie({
                    playerHeroes: [HeroId.Bastion, HeroId.Hanzo]
                });
                ctx.service.set(descriptor, '123')
                expect(
                    ctx.service.get(descriptor)
                ).toBe('123')
                ctx.service.clear(supersetDescriptor)
                expect(
                    ctx.service.get(descriptor)
                ).toBe('123')
                expect(
                    ctx.service.get(supersetDescriptor)
                ).toBeNull()
            });
            it('clearing non-existent key from cache does nothing', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                ctx.service.clear(
                    new GuideDescriptorQuickie({
                        mapTags: [MapId.BlizzardWorld]
                    })
                )
                expect(ctx.service.getAll()).toBeNull()
            });
        }
    )
)
