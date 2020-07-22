import GuidePart from "data/dto/GuidePart";
import GuidePartName from "data/dto/GuidePartName";

export default interface GuidePartText extends GuidePart {
    kind: GuidePartName.Text,
    contentMd: string
}
