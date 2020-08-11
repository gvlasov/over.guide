<template>
    <GuideBrowser
            :descriptor="descriptor"
            :base-url="'/search'"
    />
</template>

<script>
    import GuideBrowser from "@/vue/guides/GuideBrowser";
    import DescriptorParamParser from "@/js/DescriptorParamParser";
    import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";
    import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";

    export default {
        props: {},
        methods: {
            computeDescriptor(paramsText) {
                if (typeof paramsText === 'undefined') {
                    return new GuideDescriptorVso(
                        new GuideDescriptorQuickie({})
                    )
                } else {
                    return (new DescriptorParamParser()).parseParam(paramsText);
                }
            }
        },
        data() {
            return {
                descriptor: this.computeDescriptor(this.$route.params.descriptor)
            };
        },
        watch: {
            '$route.params.descriptor'(paramsText) {
                this.descriptor = this.computeDescriptor(paramsText);
            },
            descriptor: {
                handler: async function (newValue) {
                    const newPath = "/search/"
                        + new DescriptorParamUnparser().unparseDescriptor(this.descriptor);
                    if (this.$router.currentRoute.path !== newPath) {
                        await this.$router.push(newPath)
                    }
                },
                deep: true,
            }
        },
        computed: {},
        components: {
            GuideBrowser,
        },
    };

</script>

<style scoped>
</style>
