import {nestTest} from "src/test/nest-test";
import heroesFixture from "@fixtures/heroes"
import guideDescriptorsFixture from "@fixtures/guide-descriptor"
import {GuideDescriptorService} from "src/services/guide-descriptor.service";
import HeroId from "data/HeroId";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import mapsFixture from "@fixtures/maps"
import thematicTagsFixture from "@fixtures/thematicTags"
import {ContentHashService} from "src/services/content-hash.service";
import Descriptor from "data/dto/GuideDescriptorQuickie";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import AbilityId from "data/AbilityId";
import abilitiesFixture from '@fixtures/abilities'
import ImpossibleDescriptorError from "src/services/ImpossibleDescriptorError";

describe(
    GuideDescriptorService,
    nestTest(GuideDescriptorService, [], [ContentHashService], (ctx) => {
            it('finds by different hero categories', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = ctx.service.getExact(
                    new Descriptor({
                        enemyHeroes: [HeroId.Dva],
                    })
                );
                expect(descriptor).not.toBe(null)
            });
            it('gets descriptors by multiple categories', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                await ctx.service.getExact(
                    new Descriptor({
                        teammateHeroes: [HeroId.Ashe, HeroId.Baptiste],
                        enemyHeroes: [HeroId.Baptiste, HeroId.Bastion],
                        playerHeroes: [HeroId.Baptiste],
                    })
                )
                    .then(async descriptor => {
                        expect(descriptor).not.toBe(null)
                    })
            });
            it('doenst find non existent descriptors', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const descriptor = await ctx.service.getExact(
                    new Descriptor({
                        enemyHeroes: [HeroId.Zenyatta, HeroId.Zarya],
                    })
                )
                expect(descriptor).toBe(null)
            });
            it('obtains existent descriptors without creating new', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const oldCount = (await GuideDescriptor.findAndCountAll()).count;
                await ctx.service.obtainExact(
                    new Descriptor({
                        teammateHeroes: [HeroId.Ashe, HeroId.Baptiste],
                        enemyHeroes: [HeroId.Baptiste, HeroId.Bastion],
                        playerHeroes: [HeroId.Baptiste],
                    })
                )
                    .then(async descriptor => {
                        expect(
                            (await GuideDescriptor.findAndCountAll()).count
                        ).toEqual(oldCount)
                    })
            });
            it('doesnt find exact if only subset of tags matches', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    guideDescriptorsFixture
                )
                const oldCount = (await GuideDescriptor.findAndCountAll()).count;
                await ctx.service.getExact(
                    new Descriptor({
                        teammateHeroes: [HeroId.Ashe, HeroId.Baptiste],
                        enemyHeroes: [HeroId.Baptiste /* no bastion */],
                        playerHeroes: [HeroId.Baptiste],
                    })
                )
                    .then(async descriptor => {
                        expect(descriptor).toBe(null)
                        expect(oldCount).toBe(
                            (await GuideDescriptor.findAndCountAll()).count
                        );
                    })
            });
        it('doesnt find exact with same number of different data points instead of null', async () => {
            await ctx.fixtures(
                heroesFixture,
                abilitiesFixture,
                mapsFixture,
                thematicTagsFixture
            )
            await ctx.app.get(GuideDescriptorService).obtainExact(
                new GuideDescriptorQuickie({
                    teammateHeroes: [HeroId.Ana, HeroId.Reinhardt],
                })
            );
            expect(
                (await ctx.service.getExact(
                    new GuideDescriptorQuickie({
                        teammateHeroes: [HeroId.Ana, HeroId.Baptiste],
                    })
                ))
            ).toBe(null)
        });
        it('creates new descriptor if not exists when obtaining', async () => {
            await ctx.fixtures(
                heroesFixture,
                guideDescriptorsFixture
            )
            const oldCount = (await GuideDescriptor.findAndCountAll()).count;
            await ctx.service.obtainExact(
                new Descriptor({
                    playerHeroes: [HeroId.Zenyatta],
                })
                )
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
                await ctx.service.obtainExact(
                    new Descriptor({
                        mapTags: [MapId.Eichenwalde, MapId.Havana],
                        teammateHeroes: [HeroId.McCree],
                        enemyHeroes: [HeroId.WreckingBall],
                        playerHeroes: [HeroId.Zenyatta],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                    .then(async descriptor => {
                        await descriptor.reload()
                        expect((await descriptor.$get('players')).length).toBe(1)
                        expect((await descriptor.$get('teammates')).length).toBe(1)
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
                await ctx.service.obtainExact(
                    new Descriptor({
                        mapTags: [MapId.Eichenwalde, MapId.Havana],
                        teammateHeroes: [HeroId.McCree],
                        enemyHeroes: [HeroId.WreckingBall],
                        playerHeroes: [HeroId.Zenyatta],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                await ctx.service.obtainExact(
                    new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                await ctx.service.obtainExact(
                    new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                        enemyHeroes: [HeroId.Soldier],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                await ctx.service.obtainExact(
                    new Descriptor({
                        enemyHeroes: [HeroId.Soldier],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                await ctx.service.getIncluding(
                    new Descriptor({
                        mapTags: [MapId.Eichenwalde],
                        thematicTags: [GuideTheme.Psychology],
                    })
                )
                    .then(descriptors => {
                        expect(descriptors.length).toBe(3)
                    })
                await ctx.service.getIncluding(
                    new Descriptor({
                        enemyHeroes: [HeroId.Soldier],
                    })
                )
                    .then(descriptors => {
                        expect(descriptors.length).toBe(2)
                    })
                await ctx.service.getIncluding(
                    new Descriptor({
                        enemyHeroes: [HeroId.Soldier, HeroId.Dva],
                    })
                )
                    .then(descriptors => {
                        expect(descriptors.length).toBe(0)
                    })
                await ctx.service.getIncluding(
                    new Descriptor({})
                )
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
                        return ctx.service.obtainExact(
                            new Descriptor({})
                        )
                    }
                ).toThrow(`Can't obtain descriptor from empty DTO`)
            });
            it('gets existing descriptor with abilities', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                const descriptorDto = new GuideDescriptorQuickie({
                    teammateHeroes: [HeroId.Ana],
                    teammateAbilities: [AbilityId.SleepDart, AbilityId.BioticGrenade],
                    thematicTags: [GuideTheme.Psychology, GuideTheme.Communication, GuideTheme.Aim]
                });
                const descriptor = await ctx.app.get(GuideDescriptorService).obtainExact(descriptorDto)
                expect(
                    (await ctx.service.obtainExact(descriptorDto)).id
                ).toBe(descriptor.id)
            });
            it('can\'t save descriptor with ability but without hero', async () => {
                await ctx.fixtures(
                    heroesFixture,
                    abilitiesFixture,
                    mapsFixture,
                    thematicTagsFixture
                )
                // No hero at all
                expect(
                    () => ctx.app.get(GuideDescriptorService)
                            .obtainExact(
                                new GuideDescriptorQuickie({
                                    teammateAbilities: [AbilityId.SleepDart, AbilityId.BioticGrenade],
                                })
                            )
                )
                    .toThrow(ImpossibleDescriptorError)
                // Different hero
                expect(
                    () => ctx.app.get(GuideDescriptorService)
                        .obtainExact(
                            new GuideDescriptorQuickie({
                                playerHeroes: [HeroId.Junkrat],
                                playerAbilities: [AbilityId.SleepDart, AbilityId.BioticGrenade],
                            })
                        )
                )
                    .toThrow(ImpossibleDescriptorError)
                // One hero correct, one different
                expect(
                    () => ctx.app.get(GuideDescriptorService)
                        .obtainExact(
                            new GuideDescriptorQuickie({
                                enemyHeroes: [HeroId.Junkrat, HeroId.Baptiste],
                                playerAbilities: [AbilityId.TotalMayhem, AbilityId.BioticGrenade],
                            })
                        )
                )
                    .toThrow(ImpossibleDescriptorError)
            });
        }
    )
)
