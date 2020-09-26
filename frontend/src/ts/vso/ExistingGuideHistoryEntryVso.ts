import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import UserVso from "@/ts/vso/UserVso";
import UserDto from "data/dto/UserDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";
import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";

export default class ExistingGuideHistoryEntryVso extends NewGuideHistoryEntryVso implements GuideHistoryEntryVso<GuideHistoryEntryAppendDto>{
    public guideId: number;
    public author: UserVso;
    public createdAt: string;
    public updatedAt: string;

    constructor(entry: GuideHistoryEntryReadDto) {
        super(entry)
        this.guideId = entry.guide.id;
        this.author = entry.guide.author && new UserVso(entry.guide.author as UserDto);
        this.createdAt = entry.guide.createdAt;
        this.updatedAt = entry.updatedAt;
    }

    toDto(): GuideHistoryEntryAppendDto {
        return {
            ...super.toDto(),
            guideId: this.guideId,
        }
    }

}

