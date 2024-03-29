import GuidePartWidget from "@/ts/vso/GuidePartWidget";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";

export default class GuidePartVideoWidget extends GuidePartWidget {

    constructor(
        public part: GuidePartVideoDto,
        public editing: boolean = false
    ) {
        super(part, editing)
    }

    get isEmpty() {
        return this.part.excerpt.youtubeVideoId === ''
    }

    get isText(): boolean {
        return false;
    }

    get isVideo(): boolean {
        return true;
    }

}
