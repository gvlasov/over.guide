<template>
    <div class="badge-tags-wrap">
        <ThematicTagBadge
                v-for="thematicTag in descriptor.thematicTags"
                ref="thematicTags"
                :tag="thematicTag"
                :key="thematicTag.dataName"
        />
        <ThematicTagBadge
                v-for="map in descriptor.maps"
                ref="mapTags"
                :tag="map"
                :key="map.dataName"
        />
    </div>
</template>

<script lang="ts">
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";

@Component({
    components: {
        ThematicTagBadge,
    },
})
export default class TagBadges extends Vue {
    @Prop({required: true})
    descriptor: GuideDescriptorVso
};

</script>

<style lang="scss" scoped>

.badge-tags-wrap {
    .tag-custom-badge {
        margin-right: .3em;
    }

    display: inline-block;
}

</style>
