<template>
    <div class="wrap">
        <TagGroupFrame v-if="guideHeroTag.playerHeroes.length > 0">
            <template slot="infix"></template>
            <template slot="frame-content">
                <TagGroupBackground class="tag-type-links-wrap-player">
                    <TagPortraitLinked
                            v-for="hero in guideHeroTag.playerHeroes"
                            :key="hero.dataName"
                            :hero="hero"
                            :create-title="(hero) => 'More guides about playing as ' + hero.name"
                    />
                </TagGroupBackground>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame v-if="guideHeroTag.allyHeroes.length > 0">
            <template slot="infix">+</template>
            <template slot="frame-content">
                <TagGroupBackground class="tag-type-links-wrap-ally">
                    <TagPortraitLinked
                            v-for="hero in guideHeroTag.allyHeroes"
                            :key="hero.dataName"
                            :hero="hero"
                            :create-title="(hero) => 'More guides about synergizing with ' + hero.name"
                    />
                </TagGroupBackground>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame v-if="guideHeroTag.enemyHeroes.length > 0">
            <template slot="infix">VS</template>
            <template slot="frame-content">
                <TagGroupBackground class="tag-type-links-wrap-enemy">
                    <TagPortraitLinked
                            v-for="hero in guideHeroTag.enemyHeroes"
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
    import TagGroupFrame from "@/vue/guide-hero-tags/TagGroupFrame";
    import TagGroupBackground from "@/vue/guide-hero-tags/TagGroupBackground";
    import TagPortraitLinked from "@/vue/guide-hero-tags/TagPortraitLinked";

    export default {
        props: {
            guideHeroTag: {
                /**
                 * @see {GuideHeroTag}
                 */
                type: Object,
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
    .wrap {
    }

    .tag-type-links-wrap-player {
        background-color: rgba(75, 125, 217, 0.9);
    }

    .tag-type-links-wrap-ally {
        background-color: rgba(15, 213, 71, 0.9);
    }

    .tag-type-links-wrap-enemy {
        background-color: rgba(229, 34, 34, 0.9);
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

</style>
