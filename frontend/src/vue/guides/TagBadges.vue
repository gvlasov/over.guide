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

<script>
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";

export default {
    props: {
        descriptor: {
            type: GuideDescriptorVso,
            required: true
        },
    },
    data() {
        return {}
    },
    components: {
        ThematicTagBadge,
    },
};

</script>

<style lang="scss" scoped>

.badge-tags-wrap {
    display: inline-block;
    margin-right: .3em;
}

</style>
