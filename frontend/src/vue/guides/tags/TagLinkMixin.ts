import DescriptorParamUnparser from "@/ts/DescriptorParamUnparser";
import Vue from 'vue'
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import Component from "vue-class-component";

const unparser = new DescriptorParamUnparser();
@Component({})
export default class TagLinkMixin extends Vue {
    tagLink(
        descriptor: GuideDescriptorVso,
        basePath: string = '/search/'
    ): string {
        return basePath + unparser.unparseDescriptor(descriptor);
    }
}
