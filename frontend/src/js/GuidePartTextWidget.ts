import GuidePartText from "data/dto/GuidePartText";
import GuidePartWidget from "@/js/GuidePartWidget";
import md5 from 'md5'
import marked from 'marked'

export default class GuidePartTextWidget extends GuidePartWidget {

    constructor(public part: GuidePartText, public editing: boolean = false) {
        super(part, editing)
    }

    id() {
        return md5(this.part.contentMd)
    };

    isText(): this is GuidePartTextWidget {
        return true;
    }

    isVideo(): boolean {
        return false;
    }

    render(): string {
        return marked(this.part.contentMd);
    }

}
