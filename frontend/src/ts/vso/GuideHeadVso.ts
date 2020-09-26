import GuideHeadDto from "data/dto/GuideHeadDto";
import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";

export default abstract class GuideHeadVso<EntryVso extends GuideHistoryEntryVso> {
    public abstract entry: EntryVso
    public commentsCount: number
    public votesCount: number

    protected constructor(dto: GuideHeadDto<GuideHistoryEntryDto>) {
        this.commentsCount = dto.commentsCount
        this.votesCount = dto.votesCount
    }

}

