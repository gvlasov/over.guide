import GuidePartWidget from "@/js/vso/GuidePartWidget";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";

export default class GuidePartVideoWidget extends GuidePartWidget {

    constructor(
        public part: GuidePartVideoDto,
        public editing: boolean = false
    ) {
        super(part, editing)
    }

    isText(): this is GuidePartTextWidget {
        return false;
    }

    isVideo(): this is GuidePartVideoWidget {
        return true;
    }

}
