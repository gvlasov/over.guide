import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideDescriptor2TeammateHero} from "src/database/models/GuideDescriptor2TeammateHero";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import HeroId from "data/HeroId";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import {ContentHashService} from "src/services/content-hash.service";

export default async (moduleRef) => {
    const contentHashService = moduleRef.get(ContentHashService)
    const dto1 = new GuideDescriptorQuickie({
        teammateHeroes: [HeroId.Ashe, HeroId.Baptiste],
        playerHeroes: [HeroId.Baptiste],
        enemyHeroes: [HeroId.Bastion, HeroId.Baptiste],
    });
    const dto2 = new GuideDescriptorQuickie({
        enemyHeroes: [HeroId.Dva],
    });
    await GuideDescriptor.create({
        id: 1,
        contentHash: contentHashService.hash(dto1)
    })
    await GuideDescriptor.create({
        id: 2,
        contentHash: contentHashService.hash(dto2)
    })
    await GuideDescriptor2TeammateHero.create({
        guideDescriptorId: 1,
        heroId: HeroId.Ashe
    })
    await GuideDescriptor2TeammateHero.create({
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