import GuidePartText from "@/js/GuidePartText";
import GuidePart from "@/js/GuidePart";
import GuidePartVideo from "@/js/GuidePartVideo";

export default class GuidePartWidget implements GuidePart {

    constructor(public part: GuidePart, public editing: boolean = false) {
    }

    id() {
        return this.part.id()
    };

    isText(): boolean {
        return this.part instanceof GuidePartText;
    }

    isVideo(): boolean {
        return this.part instanceof GuidePartVideo;
    }

}
