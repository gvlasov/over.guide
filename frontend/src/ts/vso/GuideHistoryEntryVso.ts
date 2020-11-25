import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePartTextWidget from "@/ts/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";

export default abstract class GuideHistoryEntryVso<D = GuideHistoryEntryReadDto | GuideHistoryEntryCreateDto> {
    public descriptor: GuideDescriptorVso;
    public parts: (GuidePartTextWidget | GuidePartVideoWidget)[];
    public isPublic: boolean;

    protected constructor(entry: GuideHistoryEntryDto) {
        this.descriptor = new GuideDescriptorVso(entry.descriptor)
        this.parts = entry.parts.map(
            part =>
                part.kind === 'text'
                    ? new GuidePartTextWidget(part)
                    : new GuidePartVideoWidget(part)
        );
        this.isPublic = entry.isPublic
        console.log(entry)
    }

    get isEmpty(): boolean {
        return this.descriptor.isEmpty && this.parts.length === 0;
    }

    abstract toDto() : D;

}

