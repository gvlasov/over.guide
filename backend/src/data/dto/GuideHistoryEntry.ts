import GuideDescriptor from "data/dto/GuideDescriptor";
import GuidePart from "data/dto/GuidePart";

export default interface GuideHistoryEntry {
    id?: number,
    guideId?: number,
    descriptor: GuideDescriptor,
    parts: GuidePart[]
}
