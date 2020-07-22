import GuidePartWidget from "@/js/GuidePartWidget";
import GuidePartVideo from "data/dto/GuidePartVideo";
import md5 from "md5";
import GuidePartTextWidget from "@/js/GuidePartTextWidget";

export default class GuidePartVideoWidget extends GuidePartWidget {

    constructor(
        public part: GuidePartVideo,
        public editing: boolean = false
    ) {
        super(part, editing)
    }

    id() {
        return md5(
            'guide-part-video' + this.part.excerpt.youtubeVideoId + '-' + this.part.excerpt.startSeconds + '-' + this.part.excerpt.endSeconds
        );
    };

    isText(): this is GuidePartTextWidget {
        return false;
    }

    isVideo(): boolean {
        return true;
    }

}
