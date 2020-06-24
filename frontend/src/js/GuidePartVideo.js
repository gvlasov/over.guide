import GuidePart from "./GuidePart";
import YoutubeVideoExcerpt from "./dto/YoutubeVideoExcerpt";
import md5 from 'md5'

/**
 * @param {YoutubeVideoExcerpt} excerpt
 */
function GuidePartVideo(excerpt) {
    this.excerpt = excerpt;
}

GuidePartVideo.prototype = new GuidePart();
GuidePartVideo.prototype.id = function () {
    return md5('guide-part-video' + this.excerpt.videoId + '-' + this.excerpt.startSeconds + '-' + this.excerpt.endSeconds);
};

export default GuidePartVideo;
