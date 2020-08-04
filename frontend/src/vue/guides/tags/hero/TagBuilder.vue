<template>
    <div class="root">
        <div class="wrap">
            <TagGroupFrame>
                <template slot="infix"></template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.players.heroes.length > 0"
                            :type="'player'"
                            class="tag-type-links-wrap-player tappable-background"
                            v-hammer:tap="() => (selecting = 'player')"
                            v-bind:class="selecting === 'player' ? 'selected-group' : ''"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.players.heroes"
                                :key="hero.dataName"
                                :hero="hero"
                                class="tag-portrait"
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
                <template slot="infix">
                    <span class="infix-content infix-content-ally">+</span>
                </template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.allies.heroes.length > 0"
                            :type="'ally'"
                            class="tag-type-links-wrap-ally tappable-background"
                            v-hammer:tap="() => (selecting = 'ally')"
                            v-bind:class="selecting === 'ally' ? 'selected-group' : ''"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.allies.heroes"
                                :key="hero.dataName"
                                :hero="hero"
                                class="tag-portrait"
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
            <TagGroupFrame
            >
                <template slot="infix"><span class="infix-content">VS</span>
                </template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="guideHeroTag.enemies.heroes.length > 0"
                            :type="'enemy'"
                            class="tag-type-links-wrap-enemy tappable-background"
                            v-hammer:tap="() => (selecting = 'enemy')"
                            v-bind:class="selecting === 'enemy' ? 'selected-group' : ''"
                            style="max-height: 30px;height:30px;"
                    >
                        <TagPortrait
                                v-for="hero in guideHeroTag.enemies.heroes"
                                :key="hero.dataName"
                                :hero="hero"
                                class="tag-portrait"
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
                :tag-group="guideHeroTag.players"
                :tag-group-type="'player'"
                @save="selecting = null"
        />
        <TagBuilderRoster
                v-if="selecting === 'ally'"
                :tag-group="guideHeroTag.allies"
                :tag-group-type="'ally'"
                @save="selecting = null"
        />
        <TagBuilderRoster
                v-if="selecting === 'enemy'"
                :tag-group="guideHeroTag.enemies"
                :tag-group-type="'enemy'"
                @save="selecting = null"
        />
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import TagBuilderRoster from "@/vue/guides/tags/hero/TagBuilderRoster";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";


    export default {
        props: {
            guideHeroTag: {
                type: GuideDescriptorVso,
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
            TagBuilderRoster,
        },
    };

</script>

<style scoped>
    .root {
    }

    .wrap {
        display: inline-flex;
        padding: 0 .4rem 0 0;
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tappable-background {
        cursor: pointer;
    }

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .33em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }

    .infix-content {
        width: 1.5rem;
        display: inline-block;
    }

    .infix-content-ally {
        font-size: 1.3em;
    }

    .tag-portrait {
        height: 2.707rem;
    }
</style>
