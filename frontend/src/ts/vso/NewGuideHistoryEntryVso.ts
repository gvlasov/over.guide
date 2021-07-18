import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

export default class NewGuideHistoryEntryVso extends GuideHistoryEntryVso<GuideHistoryEntryCreateDto> {

    constructor(entry: GuideHistoryEntryCreateDto) {
        super(entry)
    }

}

