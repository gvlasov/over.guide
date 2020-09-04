<template>
    <div style="display: none;"></div>
</template>

<script>
import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import ParamsDescriptor from "@/js/ParamsDescriptor";

export default {
        model: {
            prop: 'descriptor',
            event: 'descriptorChange',
        },
        props: {
            basePath: {
                type: String,
                required: true,
            },
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            },
            enabled: {
                type: Boolean,
                default: true,
            }
        },
        methods: {
        },
        data() {
            return {
            };
        },
        watch: {
            '$route.params.descriptor'(paramsText) {
                if (!this.enabled){
                    return;
                }
                this.$emit(
                    'descriptorChange',
                    new GuideDescriptorVso(
                        new ParamsDescriptor(paramsText).compute()
                    )
                );
            },
            descriptor: {
                handler: async function (newValue) {
                    if (!this.enabled){
                        return;
                    }
                    const newPath = this.basePath
                        + new DescriptorParamUnparser().unparseDescriptor(this.descriptor);
                    if (this.$router.currentRoute.path !== newPath) {
                        await this.$router.push(newPath)
                    }
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
