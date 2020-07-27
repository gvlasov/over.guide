import {ModuleRef} from "@nestjs/core";
import HeroId from "data/HeroId";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import GuidePartTextDto from "data/dto/GuidePartTextDto";

export default async (moduleRef: ModuleRef) => {
    const entryService = moduleRef.get(GuideHistoryEntryService)
    const user = await User.create({
        name: "user man",
        battleNetUserId: "12341234"
    })
    for (let i = 0; i < 100; i++) {
        const guide = await Guide.create({
            creatorId: user.id,
        })
        await entryService.save({
            guideId: guide.id,
            parts: [
                {contentMd: 'asdf ' + i, kind: 'text'} as GuidePartTextDto
            ],
            descriptor: {
                playerHeroes: [HeroId.Dva],
                allyHeroes: [],
                enemyHeroes: [],
                mapTags: [],
                thematicTags: []
            }
        }, user)
    }
}