import GuideHeroTag from "src/data/dto/GuideHeroTag";
import GuideTheme from "src/data/GuideTheme";

export default interface GuideDescriptor {
    heroTag: GuideHeroTag,
    thematicTags: GuideTheme[]
}
