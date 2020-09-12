import ParamsDescriptor from "@/js/ParamsDescriptor";
import DescriptorParseError from "@/js/DescriptorParseError";

export default {
    methods: {
        obtainParamsDescriptor(paramsText) {
            if (typeof paramsText === 'undefined') {
                if (!this.$route.params.hasOwnProperty('descriptor')) {
                    console.log(this.$route)
                    throw new Error('No "descriptor" param in current route')
                }
                paramsText = this.$route.params.descriptor
            }
            try {
                return new ParamsDescriptor(paramsText).compute();
            } catch (e) {
                if (e instanceof DescriptorParseError) {
                    this.$router.push(
                        this.$route.fullPath.substr(
                            0,
                            this.$route.fullPath.lastIndexOf(
                                this.$route.params.descriptor
                            )
                        )
                    )
                } else  {
                    throw e
                }
            }
        }
    },
}