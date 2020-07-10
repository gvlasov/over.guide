import GuidePart from "./GuidePart";
import md5 from 'md5'

export default class GuidePartText implements GuidePart {

    text: string;

    constructor(text: string) {
        this.text = text;
    }

    id() {
        return md5(this.text)
    };

}
