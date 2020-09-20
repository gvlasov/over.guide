import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import DescriptorParamParser from "@/ts/DescriptorParamParser";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";

export default class ParamsDescriptor {
    constructor(private readonly paramsText: string | undefined) {

    }

    compute(): GuideDescriptorDto {
        if (typeof this.paramsText === 'undefined') {
            return new GuideDescriptorQuickie({})
        } else {
            return (new DescriptorParamParser()).parseParam(this.paramsText);
        }
    }

    get hasParams() {
        return typeof this.paramsText !== 'undefined'
    }

}
