import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
import UserVso from "@/js/vso/UserVso";
import UserDto from "data/dto/UserDto";
import GuideTopic from "@/js/GuideTopic";

export default class GuideVso {
    public guideId: number;
    public author: UserVso;
    public descriptor: GuideDescriptorVso;
    public createdAt: string;
    public parts: (GuidePartTextWidget | GuidePartVideoWidget)[];

    constructor(entry: GuideHistoryEntryDto) {
        this.guideId = entry.guideId as number;
        this.author = new UserVso(entry.author as UserDto);
        this.descriptor = new GuideDescriptorVso(entry.descriptor)
        this.createdAt = entry.createdAt as string;
        this.parts = entry.parts.map(
            part =>
                part.kind === 'text'
                    ? new GuidePartTextWidget(part)
                    : new GuidePartVideoWidget(part)
        );
    }

    get topic(): GuideTopic {
        return new GuideTopic(this.guideId)
    }

}

