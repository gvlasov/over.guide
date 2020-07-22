import GuidePart from "data/dto/GuidePart";
import YoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpt";
import GuidePartName from "data/dto/GuidePartName";

export default interface GuidePartVideo extends GuidePart {
    kind: GuidePartName.Video,
    excerpt: YoutubeVideoExcerpt;
}
