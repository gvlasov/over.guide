import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import HeroId from "data/HeroId";

export default async (moduleRef) => {

    await GuideDescriptor.create({
        id: 1
    })
    await GuideDescriptor.create({
        id: 2
    })
    await GuideDescriptor2AllyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Ashe
    })
    await GuideDescriptor2AllyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Baptiste
    })
    await GuideDescriptor2PlayerHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Baptiste
    })
    await GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Bastion
    })
    await GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Baptiste
    })
    await GuideDescriptor2EnemyHero.create({
        guideDescriptorId: 2,
        heroId: HeroId.Dva
    })
}