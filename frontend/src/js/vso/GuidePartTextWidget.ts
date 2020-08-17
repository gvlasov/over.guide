import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuidePartWidget from "@/js/vso/GuidePartWidget";
import md5 from 'md5'
import marked from 'marked'
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";

export default class GuidePartTextWidget extends GuidePartWidget {

    constructor(public part: GuidePartTextDto, public editing: boolean = false) {
        super(part, editing)
    }

    id() {
        return md5(this.part.contentMd)
    };

    isText(): this is GuidePartTextWidget {
        return true;
    }

    isVideo(): this is GuidePartVideoWidget {
        return false;
    }

    render(): string {
        return marked(this.part.contentMd);
    }

    get hasContent(): boolean {
        return this.part.contentMd !== '';
    }

}
