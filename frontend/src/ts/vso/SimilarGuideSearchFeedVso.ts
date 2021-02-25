import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuideSearchFeedVso from "@/ts/vso/GuideSearchFeedVso";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";

export default class SimilarGuideSearchFeedVso extends GuideSearchFeedVso {

    constructor(
        descriptor: GuideDescriptorVso,
        protected readonly entry: ExistingGuideHistoryEntryVso | null
    ) {
        super(descriptor, false);
    }

    get feed(): (ids: number[]) => Promise<GuideSearchPageDto> {
        return (ids: number[]) => {
            if (this.entry === null) {
                return super.feed(ids)
            } else {
                const entryId = this.entry.guideId
                console.log('skip', entryId, ids, ids.filter(id => id !== entryId))
                return super.feed(ids)
                    .then(result => {
                        result.items = result.items.filter(item => item.guideHistoryEntry.guide.id !== entryId)
                        return result
                    })
            }
        }
    }

}
