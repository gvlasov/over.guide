import GuideHeadDto from "data/dto/GuideHeadDto";
import GuideHeadVso from "@/ts/vso/GuideHeadVso";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

export default class NewGuideHeadVso extends GuideHeadVso<NewGuideHistoryEntryVso> {
    public entry: NewGuideHistoryEntryVso;

    constructor(dto: GuideHeadDto<GuideHistoryEntryCreateDto>) {
        super(dto)
        this.entry = new NewGuideHistoryEntryVso(dto.guideHistoryEntry)
    }

}

