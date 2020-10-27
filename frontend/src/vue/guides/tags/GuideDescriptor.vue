<template>
    <div class="tags">
        <HeroTag
                v-if="descriptor.hasHeroes"
                class="hero-tag"
                :descriptor="descriptor"
        />
        <TagBadges
                v-if="descriptor.individualTags.length > 0"
                :descriptor="descriptor"
        />
    </div>
</template>

<script lang="ts">
import HeroTag from "@/vue/guides/tags/hero/HeroTag";
import TagBadges from "@/vue/guides/TagBadges";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'

@Component({
    components: {
        TagBadges,
        HeroTag,
    },
})
export default class Descriptor extends Vue {

    @Prop({required: true})
    descriptor: GuideDescriptorVso

};

</script>

<style lang="scss" scoped>
.tags {
    display: flex;
    gap: .5em;
    align-items: center;
    text-align: left;
    cursor: pointer;

    .hero-tag {
        display: inline-block;
    }


}
</style>
