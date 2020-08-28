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
import ParamsDescriptor from "@/js/ParamsDescriptor";

export default {
    methods: {},
    data() {
        return {
            descriptor: new ParamsDescriptor(this.$route.params.descriptor).compute(),
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
