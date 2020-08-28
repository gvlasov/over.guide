import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import DescriptorParamParser from "@/js/DescriptorParamParser";

export default class ParamsDescriptor {
    constructor(private readonly paramsText: string | undefined) {

    }

    compute(): GuideDescriptorVso {
        if (typeof this.paramsText === 'undefined') {
            return new GuideDescriptorVso(
                new GuideDescriptorQuickie({})
            )
        } else {
            return (new DescriptorParamParser()).parseParam(this.paramsText);
        }
    }

}
