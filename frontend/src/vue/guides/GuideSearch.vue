<template>
    <div>
        <ParameterDescriptorSynchronizer
                v-model="descriptor"
                base-path="/search/"
        />
        <GuideBrowser v-model="descriptor"/>
    </div>
</template>

<script lang="ts">
import GuideBrowser from "@/vue/guides/GuideBrowser";
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import ParamsDescriptorMixin from "@/ts/ParamsDescriptorMixin";
import Component, {mixins} from "vue-class-component";

@Component({
    components: {
        ParameterDescriptorSynchronizer,
        GuideBrowser,
    },
})
export default class GuideSearch extends mixins(ParamsDescriptorMixin) {
    descriptor: GuideDescriptorVso =
        new GuideDescriptorVso(
            this.obtainParamsDescriptor()
        );
}

</script>

<style scoped>
</style>
