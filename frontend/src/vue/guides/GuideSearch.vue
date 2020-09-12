<template>
    <div>
        <ParameterDescriptorSynchronizer
                v-model="descriptor"
                base-path="/search/"
        />
        <GuideBrowser v-model="descriptor"/>
    </div>
</template>

<script>
import GuideBrowser from "@/vue/guides/GuideBrowser";
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import ParamsDescriptorMixin from "@/js/ParamsDescriptorMixin";

export default {
    mixins: [ParamsDescriptorMixin],
    data() {
        return {
            descriptor: new GuideDescriptorVso(
                this.obtainParamsDescriptor()
            ),
        };
    },
    components: {
        ParameterDescriptorSynchronizer,
        GuideBrowser,
    },
};

</script>

<style scoped>
</style>
