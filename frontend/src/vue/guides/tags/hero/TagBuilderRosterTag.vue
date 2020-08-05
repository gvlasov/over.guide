<template>
    <div class="wrap">
        <TagGroupFrame
                v-hammer:tap="() => $emit('playerTap')"
        >
            <template slot="infix"></template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.players.heroes.length > 0"
                        :type="'player'"
                        v-bind:class="{ selected : selectedPosition.dataName === 'player', 'not-selected': selectedPosition.dataName !== 'player' }"
                >
                    <TagPortrait
                            v-for="hero in descriptor.players.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                    />
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'player')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'player', 'not-selected': selectedPosition.dataName !== 'player' }"
                >
                    <div class="invite-text">any<br/>player</div>
                </TagGroupInvite>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame
                v-hammer:tap="() => $emit('allyTap')"
        >
            <template slot="infix">
                <div class="infix-ally">+</div>
            </template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.allies.heroes.length > 0"
                        :type="'ally'"
                        v-bind:class="{ selected : selectedPosition.dataName === 'ally', 'not-selected': selectedPosition.dataName !== 'ally' }"
                >
                    <TagPortrait
                            v-for="hero in descriptor.allies.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                    />
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'ally')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'ally', 'not-selected': selectedPosition.dataName !== 'ally' }"
                >
                    <div class="invite-text">any<br/>ally</div>
                </TagGroupInvite>
            </template>
        </TagGroupFrame><!--
        -->
        <TagGroupFrame
                v-hammer:tap="() => $emit('enemyTap')"
        >
            <template slot="infix">
                <div class="infix-enemy">VS</div>
            </template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.enemies.heroes.length > 0"
                        :type="'enemy'"
                        v-bind:class="{ selected : selectedPosition.dataName === 'enemy', 'not-selected': selectedPosition.dataName !== 'enemy' }"
                >
                    <TagPortrait
                            v-for="hero in descriptor.enemies.heroes"
                            :key="hero.dataName"
                            :hero="hero"
                    />
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'enemy')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'enemy', 'not-selected': selectedPosition.dataName !== 'enemy' }"
                >
                    <div class="invite-text">any<br/>enemy</div>
                </TagGroupInvite>
            </template>
        </TagGroupFrame>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import GamerPositionVso from "@/js/vso/GamerPositionVso";

    export default {
        props: {
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            },
            selectedPosition: {
                type: GamerPositionVso,
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
            TagPortrait,
            TagGroupInvite,
        },
    };

</script>

<style scoped>
    .wrap {
        font-size: 0;
    }

    .wrap > * {
        font-size: 1rem;
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .selected {
        box-shadow: 0 0 .5em orange, 0 0 .5em orange, 0 0 .5em orange;
    }

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .33em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }

    .infix-ally, .infix-enemy {
        width: 1.5em;
    }
</style>
