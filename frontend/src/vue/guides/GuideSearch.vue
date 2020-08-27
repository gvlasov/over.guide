<template>
    <div>
        <ParameterDescriptorSynchronizer
                @descriptorChange="(newDescriptor) => {descriptor = newDescriptor}"
                base-path="/search/"
        />
        <GuideBrowser
                :descriptor="descriptor"
                :base-url="'/search'"
        />
    </div>
</template>

<script>
import GuideBrowser from "@/vue/guides/GuideBrowser";
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";

export default {
    data() {
        return {
            descriptor: new GuideDescriptorVso(
                new GuideDescriptorQuickie({})
            )
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
