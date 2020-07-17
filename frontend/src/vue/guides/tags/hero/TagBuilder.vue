<template>
    <div class="root">
        <div class="wrap">
            <TagGroupFrame>
                <template slot="infix"></template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.playerHeroes.length > 0"
                            class="tag-type-links-wrap-player tappable-background"
                            v-hammer:tap="() => (selecting = 'player')"
                            v-bind:class="selecting === 'player' ? 'selected-group' : ''"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.playerHeroes"
                                :key="hero.dataName"
                                :hero="hero"
                        />
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            v-hammer:tap="() => (selecting = 'player')"
                            v-bind:class="selecting === 'player' ? 'selected-group' : ''"
                    >
                        <div class="invite-text">any<br/>player</div>
                    </TagGroupInvite>
                </template>
            </TagGroupFrame><!--
        -->
            <TagGroupFrame>
                <template slot="infix">+</template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.allyHeroes.length > 0"
                            class="tag-type-links-wrap-ally tappable-background"
                            v-hammer:tap="() => (selecting = 'ally')"
                            v-bind:class="selecting === 'ally' ? 'selected-group' : ''"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.allyHeroes"
                                :key="hero.dataName"
                                :hero="hero"
                        />
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            v-hammer:tap="() => (selecting = 'ally')"
                            v-bind:class="selecting === 'ally' ? 'selected-group' : ''"
                    >
                        <div class="invite-text">any<br/>ally</div>
                    </TagGroupInvite>
                </template>
            </TagGroupFrame>
            <TagGroupFrame>
                <template slot="infix">VS</template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.enemyHeroes.length > 0"
                            class="tag-type-links-wrap-enemy tappable-background"
                            v-hammer:tap="() => (selecting = 'enemy')"
                            v-bind:class="selecting === 'enemy' ? 'selected-group' : ''"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.enemyHeroes"
                                :key="hero.dataName"
                                :hero="hero"
                        />
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            v-hammer:tap="() => (selecting = 'enemy')"
                            v-bind:class="selecting === 'enemy' ? 'selected-group' : ''"
                    >
                        <div class="invite-text">any<br/>enemy</div>
                    </TagGroupInvite>
                </template>
            </TagGroupFrame>
        </div>
        <TagBuilderRoster
                v-if="selecting === 'player'"
                v-model="guideHeroTag.playerHeroes"
                @save="selecting = null"
        />
        <TagBuilderRoster
                v-if="selecting === 'ally'"
                v-model="guideHeroTag.allyHeroes"
                @save="selecting = null"
        />
        <TagBuilderRoster
                v-model="guideHeroTag.enemyHeroes"
                v-if="selecting === 'enemy'"
                @save="selecting = null"
        />
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import Roster from "@/vue/Roster";
    import TagBuilderRoster from "@/vue/guides/tags/hero/TagBuilderRoster";


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
            return {
                selecting: null,
            };
        },
        mounted() {
        },
        methods: {},
        computed: {},
        components: {
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
            Roster,
            TagBuilderRoster,
        },
    };

</script>

<style scoped>
    .root {
    }

    .wrap {
        display: inline-flex;
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

    .tappable-background {
        cursor: pointer;
    }

    .selected-group {
        box-shadow: 0 0 3pt 2pt orange;
    }

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .33em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }
</style>
