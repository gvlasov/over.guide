import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";

export default class GuideVso {
    public guideId: number;
    public descriptor: GuideDescriptorVso;
    public parts: (GuidePartTextWidget | GuidePartVideoWidget)[];

    constructor(entry: GuideHistoryEntryDto) {
        this.guideId = entry.guideId as number;
        this.descriptor = new GuideDescriptorVso(entry.descriptor)
        this.parts = entry.parts.map(
            part =>
                part.kind === 'text'
                    ? new GuidePartTextWidget(part)
                    : new GuidePartVideoWidget(part)
        );
    }

}

