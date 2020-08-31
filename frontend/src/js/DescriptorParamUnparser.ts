import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import TagGroupVso from "@/js/vso/TagGroupVso";

export default class DescriptorParamUnparser {

    unparseDescriptor(vso: GuideDescriptorVso) {
        return [
            DescriptorParamUnparser.unparseTagGroup(vso.players),
            DescriptorParamUnparser.unparseTagGroup(vso.teammates),
            DescriptorParamUnparser.unparseTagGroup(vso.enemies),
            DescriptorParamUnparser.unparseThematicTags(vso),
            DescriptorParamUnparser.unparseMapTags(vso),
        ]
            .filter(it => it !== null)
            .join(';');
    }

    private static unparseThematicTags(vso: GuideDescriptorVso) {
        if (vso.thematicTags.length === 0) {
            return null;
        }
        return 'tags:' + vso.thematicTags.map(tag => tag.dataName).join(',');
    }

    private static unparseMapTags(vso: GuideDescriptorVso) {
        if (vso.maps.length === 0) {
            return null;
        }
        return 'maps:' + vso.maps.map(tag => tag.dataName).join(',');
    }

    private static unparseTagGroup(tagGroup: TagGroupVso): null | string {
        if (
            tagGroup.heroes.length === 0
            && tagGroup.abilities.length === 0
        ) {
            return null
        }
        const elements = tagGroup.heroes.map(h => h.dataName).concat(
            tagGroup.abilities.map(a => a.dataName)
        );
        return tagGroup.gamerPosition.plural.toLowerCase() + ':' +
            elements
                .join(',');
    }

}
