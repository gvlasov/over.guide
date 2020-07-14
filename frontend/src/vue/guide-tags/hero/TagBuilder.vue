<template>
    <div>
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
                    >Player
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
                    >Ally
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
                    >Enemy
                    </TagGroupInvite>
                </template>
            </TagGroupFrame>
        </div>
        <TagBuilderRoster
                v-model="guideHeroTag.playerHeroes"
                v-if="selecting === 'player'"
                @save="selecting = null"
        />
        <TagBuilderRoster
                v-model="guideHeroTag.allyHeroes"
                v-if="selecting === 'ally'"
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
    import TagGroupFrame from "@/vue/guide-tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guide-tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guide-tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guide-tags/hero/TagGroupInvite";
    import Roster from "@/vue/Roster";
    import TagBuilderRoster from "@/vue/guide-tags/hero/TagBuilderRoster";


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
</style>
