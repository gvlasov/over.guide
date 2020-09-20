import ParamsDescriptor from "@/ts/ParamsDescriptor";
import DescriptorParseError from "@/ts/DescriptorParseError";
import Vue from 'vue'
import Component from "vue-class-component";

@Component
export default class ParamsDescriptorMixin extends Vue {
    $route: any
    $router: any

    obtainParamsDescriptor(paramsText?: string) {
        if (paramsText === undefined) {
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
}