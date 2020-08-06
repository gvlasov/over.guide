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
                    <TagGroupHeroes :tag-group="descriptor.players"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'player')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'player', 'not-selected': selectedPosition.dataName !== 'player' }"
                >any<br/>player
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
                    <TagGroupHeroes :tag-group="descriptor.allies"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'ally')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'ally', 'not-selected': selectedPosition.dataName !== 'ally' }"
                >any<br/>ally
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
                    <TagGroupHeroes :tag-group="descriptor.enemies"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        v-hammer:tap="() => (selecting = 'enemy')"
                        v-bind:class="{ selected : selectedPosition.dataName === 'enemy', 'not-selected': selectedPosition.dataName !== 'enemy' }"
                >any<br/>enemy
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
    import AbilityIcon from "@/vue/AbilityIcon";
    import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";

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
            AbilityIcon,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
            TagGroupInvite,
            TagGroupHeroes,
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

    .infix-ally, .infix-enemy {
        width: 1.5em;
    }
</style>
