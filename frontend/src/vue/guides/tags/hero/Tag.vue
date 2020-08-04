<template>
    <div class="wrap">
        <TagGroupFrame v-if="descriptor.players.heroes.length > 0">
            <template slot="infix"></template>
            <template slot="frame-content">
                <TagGroupBackground
                        :type="'player'"
                        class="tag-type-links-wrap-player"
                >
                    <TagPortraitLinked
                            v-for="hero in descriptor.players.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                            :create-title="(hero) => 'More guides about playing as ' + hero.name"
                    />
                </TagGroupBackground>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame v-if="descriptor.allies.heroes.length > 0">
            <template slot="infix">+</template>
            <template slot="frame-content">
                <TagGroupBackground
                        class="tag-type-links-wrap-ally"
                        :type="'ally'"
                >
                    <TagPortraitLinked
                            v-for="hero in descriptor.allies.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                            :create-title="(hero) => 'More guides about synergizing with ' + hero.name"
                    />
                </TagGroupBackground>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame v-if="descriptor.enemies.heroes.length > 0">
            <template slot="infix">VS</template>
            <template slot="frame-content">
                <TagGroupBackground
                        class="tag-type-links-wrap-enemy"
                        :type="'enemy'"
                >
                    <TagPortraitLinked
                            v-for="hero in descriptor.enemies.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                            :create-title="(hero) => 'More guides about countering ' + hero.name"
                    />
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortraitLinked from "@/vue/guides/tags/hero/TagPortraitLinked";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";

    export default {
        props: {
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            }
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
            TagPortraitLinked
        },
    };

</script>

<style scoped>
    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

</style>
