import {ModuleRef} from "@nestjs/core";
import {GuideHistoryEntryService} from "src/services/guide-history-entry.service";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import DescriptorGenerator from "data/generators/DescriptorGenerator";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import abilities from 'data/abilities'
import {ContentHashService} from "src/services/content-hash.service";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";

type ReturnFunction = (moduleRef: ModuleRef) => void
export default function createGuideTestingFixture(size: number): ReturnFunction {
    return async (moduleRef: ModuleRef) => {
        const entryService = moduleRef.get(GuideHistoryEntryService)
        const user = await User.create({
            name: "user man",
            battleNetUserId: "12341234",
            banned: 0,
        })
        const videoId = 'vGc4mg5pul4'
        const generator = new DescriptorGenerator({
            numberOfThematicTags: [1, 3],
            numberOfHeroTags: [1, 4],
            abilitiesPerHero: [2, 3],
        })
        const contentHashService = moduleRef.get(ContentHashService)
        for (let i = 0; i < size; i++) {
            const guide = await Guide.create({
                authorId: user.id,
                isPublic: 1,
            })
            const parts = [];
            if (Math.random() * 10 < 3) {
                parts.push({
                    excerpt: {
                        startSeconds: 155,
                        endSeconds: 159,
                        youtubeVideoId: videoId,
                    },
                    kind: 'video'
                } as GuidePartVideoDto)
            }
            if (Math.random() * 10 < 8) {
                parts.push({
                    contentMd: abilities.get(3).description,
                    kind: 'text'
                } as GuidePartTextDto)
            }
            if (parts.length === 0) {
                parts.push({
                    contentMd: 'asdf ' + i,
                    kind: 'text'
                } as GuidePartTextDto)
            }
            const descriptor = generator.generate(i);
            await entryService.append({
                guideId: guide.id,
                parts: parts,
                descriptor: descriptor,
                isPublic: true,
            } as GuideHistoryEntryAppendDto, user)
        }
    }
}