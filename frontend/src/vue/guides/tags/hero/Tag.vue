<template>
    <div>
        <TagGroupFrame
                v-if="descriptor.players.heroes.length > 0"
                :tag-group="descriptor.players"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.players.heroes.length > 0"
                        :tag-group="descriptor.players"
                >
                    <TagGroupHeroes :tag-group="descriptor.players"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-if="descriptor.allies.heroes.length > 0"
                :tag-group="descriptor.allies"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.allies.heroes.length > 0"
                        :tag-group="descriptor.allies"
                >
                    <TagGroupHeroes :tag-group="descriptor.allies"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-if="descriptor.enemies.heroes.length > 0"
                :tag-group="descriptor.enemies"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.enemies.heroes.length > 0"
                        :tag-group="descriptor.enemies"
                >
                    <TagGroupHeroes :tag-group="descriptor.enemies"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";

    export default {
        props: {
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            },
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {},
        computed: {},
        components: {
            TagGroupBackground,
            TagGroupFrame,
            TagGroupHeroes,
        },
    };

</script>

<style lang="scss" scoped>
    ::v-deep .tag-type-infix {
        display: none;
    }
</style>
