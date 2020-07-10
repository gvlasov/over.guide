import GuidePart from "./GuidePart";
import YoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpt";
import md5 from 'md5'

export default class GuidePartVideo implements GuidePart {

    excerpt: YoutubeVideoExcerpt;

    constructor(excerpt: YoutubeVideoExcerpt) {
        this.excerpt = excerpt;
    }

    id() {
        return md5('guide-part-video' + this.excerpt.youtubeVideoId + '-' + this.excerpt.startSeconds + '-' + this.excerpt.endSeconds);
    };
}
