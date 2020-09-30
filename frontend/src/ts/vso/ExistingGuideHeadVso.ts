import GuideHeadDto from "data/dto/GuideHeadDto";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHeadVso from "@/ts/vso/GuideHeadVso";
import PostVso from "@/ts/vso/PostVso";
import PostTypeId from "data/PostTypeId";

export default class ExistingGuideHeadVso extends GuideHeadVso<ExistingGuideHistoryEntryVso> implements PostVso {
    public entry: ExistingGuideHistoryEntryVso;
    public commentsCount: number
    public votesCount: number

    constructor(dto: GuideHeadDto<GuideHistoryEntryReadDto>) {
        super(dto)
        this.entry = new ExistingGuideHistoryEntryVso(dto.guideHistoryEntry)
        this.commentsCount = dto.commentsCount
        this.votesCount = dto.votesCount
    }

    get postId(): number {
        return this.entry.guideId;
    }

    get postType(): PostTypeId {
        return PostTypeId.Guide
    }

    get authorId(): number {
        return this.entry.author.id
    }

}

