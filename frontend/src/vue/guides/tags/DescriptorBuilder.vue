<template>
    <div class="descriptor-builder">
        <HeroTagBuilder
                v-model="localDescriptor"
        />
        <ThematicTagInput
            :descriptor="descriptor"
        />
        <slot/>
    </div>
</template>

<script lang="ts">
import HeroTagBuilder from "@/vue/guides/tags/hero/HeroTagBuilder";
import ThematicTagInput from "@/vue/guides/ThematicTagInput";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import OverwatchButton from "@/vue/OverwatchButton";
import Component from "vue-class-component";
import Vue from 'vue'
import {Model, Prop} from "vue-property-decorator";

@Component({
    components: {
        OverwatchButton,
        HeroTagBuilder,
        ThematicTagInput,
    },
})
export default class DescriptorBuilder extends Vue {

    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    @Prop({
        default: true,
        type: Boolean,
    })
    searchButtonEnabled: boolean

    get localDescriptor() {
        return this.descriptor
    }

    set localDescriptor(descriptor: GuideDescriptorVso) {
        this.$emit('descriptorChange', descriptor)
    }


}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";


.descriptor-builder {
    display: flex;
    flex-wrap: wrap;
    gap: .4em;
    justify-content: center;
    box-sizing: border-box;
    padding: .5rem 0 .5rem 0;
    background: #fff;
    border-radius: .4em;
    border-color: #dbdbdb;
    box-shadow: 0 .1em .3em rgba($overwatch-panel-bg-color, .4);
    .thematic-tag-input {
        display: block;
        min-width: 17em;
        flex-grow: 1;
    }

    &.active {
        border: 1px solid #8bbafe;
        box-shadow: 0 0 0 0.2em rgba(13, 110, 253, 0.25);
        outline: 0 none;
    }
}

</style>