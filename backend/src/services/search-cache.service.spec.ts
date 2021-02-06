import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import guideDescriptorsFixture from "@fixtures/guide-descriptor"
import SearchCacheService from "src/services/search-cache.service";
import singleUserFixture from "@fixtures/single-user";
import abilitiesFixture from "@fixtures/abilities";
import mapsFixture from "@fixtures/maps";
import thematicTagsFixture from "@fixtures/thematicTags";
import smallGuideTestingFixture from "@fixtures/small-guide-testing";
import MapId from "data/MapId";
import HeroId from "data/HeroId";
import GuideSearchQueryQuickie from "data/dto/GuideSearchQueryQuickie";

describe(
    SearchCacheService,
    nestTest(SearchCacheService, (ctx) => {
            it('returns null for any query to empty cache', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                expect(ctx.service.get(new GuideSearchQueryQuickie({}))).toBeNull()
                const query = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Bastion]
                });
                expect(ctx.service.get(query)).toBeNull()
            });
            it('removes values from cache by exact query', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const query = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Bastion]
                });
                ctx.service.set(query, '123')
                expect(
                    ctx.service.get(query)
                ).toBe('123')
                ctx.service.clear(query)
                expect(
                    ctx.service.get(query)
                ).toBeNull()
            });
            it('removes values from cache by subset query', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const query = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Bastion, HeroId.Hanzo]
                });
                const subsetQuery = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Hanzo]
                });
                ctx.service.set(query, '123')
                expect(
                    ctx.service.get(query)
                ).toBe('123')
                ctx.service.clear(subsetQuery)
                expect(
                    ctx.service.get(query)
                ).toBeNull()
                expect(
                    ctx.service.get(subsetQuery)
                ).toBeNull()
            });
            it('doesnt remove values from cache by superset query', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const query = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Hanzo]
                });
                const supersetQuery = new GuideSearchQueryQuickie({
                    playerHeroes: [HeroId.Bastion, HeroId.Hanzo]
                });
                ctx.service.set(query, '123')
                expect(
                    ctx.service.get(query)
                ).toBe('123')
                ctx.service.clear(supersetQuery)
                expect(
                    ctx.service.get(query)
                ).toBe('123')
                expect(
                    ctx.service.get(supersetQuery)
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
                    new GuideSearchQueryQuickie({
                        mapTags: [MapId.BlizzardWorld]
                    })
                )
                expect(ctx.service.get(new GuideSearchQueryQuickie({}))).toBeNull()
            });
            it('works with obscene amount of query parameters', async () => {
                await ctx.fixtures(
                    singleUserFixture,
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture,
                    smallGuideTestingFixture
                )
                const clientGuideIds = []
                for (let i = 0; i < 100000; i++) {
                    clientGuideIds.push(i)
                }
                const query = new GuideSearchQueryQuickie({
                    mapTags: [MapId.BlizzardWorld],
                    clientAlreadyHasGuideIds: clientGuideIds
                });
                const anotherQuery = new GuideSearchQueryQuickie({
                    mapTags: [MapId.BlizzardWorld, MapId.Busan],
                    clientAlreadyHasGuideIds: clientGuideIds
                });
                ctx.service.set(query, '3434')
                expect(ctx.service.get(anotherQuery)).toBeNull()
            });
        }
    )
)
