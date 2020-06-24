import GuidePart from "./GuidePart";
import md5 from 'md5'

function GuidePartText(text) {
    this.text = text;
}

GuidePartText.prototype = new GuidePart();
GuidePartText.prototype.id = function () {
    return md5(this.text)
};

export default GuidePartText;
