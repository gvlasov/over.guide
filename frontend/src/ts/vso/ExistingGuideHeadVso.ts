import GuideHeadDto from "data/dto/GuideHeadDto";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHeadVso from "@/ts/vso/GuideHeadVso";

export default class ExistingGuideHeadVso extends GuideHeadVso<ExistingGuideHistoryEntryVso> {
    public entry: ExistingGuideHistoryEntryVso;
    public commentsCount: number
    public votesCount: number

    constructor(dto: GuideHeadDto<GuideHistoryEntryReadDto>) {
        super(dto)
        this.entry = new ExistingGuideHistoryEntryVso(dto.guideHistoryEntry)
        this.commentsCount = dto.commentsCount
        this.votesCount = dto.votesCount
    }

}

