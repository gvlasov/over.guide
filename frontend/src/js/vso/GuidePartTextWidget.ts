import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuidePartWidget from "@/js/vso/GuidePartWidget";

export default class GuidePartTextWidget extends GuidePartWidget {

    constructor(public part: GuidePartTextDto, public editing: boolean = false) {
        super(part, editing)
    }

    get isEmpty() {
        return this.part.contentMd.trim() === '';
    }

}
