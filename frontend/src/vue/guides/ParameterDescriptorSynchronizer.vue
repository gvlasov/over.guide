<template>
    <div style="display: none;"></div>
</template>

<script lang="ts">
import DescriptorParamUnparser from "@/ts/DescriptorParamUnparser";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import ParamsDescriptorMixin from "@/ts/ParamsDescriptorMixin";
import {Model, Prop, Watch} from "vue-property-decorator";
import Component, {mixins} from "vue-class-component";

@Component({})
export default class ParameterDescriptorSynchronizer extends mixins(ParamsDescriptorMixin) {
    $router: any

    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    @Prop({required: true})
    basePath: string

    @Prop({default: false})
    writeDescriptorToParams: boolean

    @Prop({default: false})
    writeParamsToDescriptor: boolean

    @Watch('$route.params.descriptor')
    onRouteParamsDescriptorChange(paramsText?: string) {
        this.$emit(
            'descriptorChange',
            new GuideDescriptorVso(
                this.obtainParamsDescriptor(paramsText)
            )
        );
    }

    @Watch('descriptor', {deep: true})
    onDescriptorChange() {
        if (!this.writeDescriptorToParams) {
            return false
        }
        let guideIdPart;
        if (this.$route.params.hasOwnProperty('id')) {
            const guideIdParam = this.$route.params.id
            guideIdPart =
                ((typeof guideIdParam !== 'undefined')
                    ? guideIdParam
                    : 'new') + '/';
        } else {
            guideIdPart = '';
        }
        const newPath = this.basePath
            + guideIdPart
            + new DescriptorParamUnparser().unparseDescriptor(this.descriptor);
        if (this.$router.currentRoute.path !== newPath) {
            this.$router.push(newPath)
        }
    }

}
</script>

<style scoped>
</style>
