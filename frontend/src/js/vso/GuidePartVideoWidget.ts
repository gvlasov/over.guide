import GuidePartWidget from "@/js/vso/GuidePartWidget";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import md5 from "md5";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";

export default class GuidePartVideoWidget extends GuidePartWidget {

    constructor(
        public part: GuidePartVideoDto,
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

    isVideo(): this is GuidePartVideoWidget {
        return true;
    }

}
