<template>
    <div style="display: none;"></div>
</template>

<script>
import DescriptorParamParser from "@/js/DescriptorParamParser";
import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";

export default {
        props: {
            basePath: {
                type: String,
                required: true,
            }
        },
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
                    const newPath = this.basePath
                        + new DescriptorParamUnparser().unparseDescriptor(this.descriptor);
                    if (this.$router.currentRoute.path !== newPath) {
                        await this.$router.push(newPath)
                    }
                    this.$emit('descriptorChange', this.descriptor)
                },
                deep: true,
            }
        },
        mounted() {
            this.$emit('descriptorChange', this.descriptor)
        }
    };

</script>

<style scoped>
</style>
