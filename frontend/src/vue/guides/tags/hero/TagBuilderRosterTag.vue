<template>
    <div class="wrap">
        <TagGroupFrame
                v-hammer:tap="() => $emit('playerTap')"
                :tag-group="descriptor.players"
        >
            <template slot="infix"></template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.players.heroes.length > 0"
                        :tag-group="descriptor.players"
                        v-bind:class="{ selected : selectedPosition.isPlayer}"
                >
                    <TagGroupHeroes :tag-group="descriptor.players"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        :tag-group="descriptor.players"
                        v-hammer:tap="() => (selecting = 'player')"
                        v-bind:class="{ selected : selectedPosition.isPlayer}"
                />
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-hammer:tap="() => $emit('allyTap')"
                :tag-group="descriptor.allies"
        >
            <template slot="infix">+</template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.allies.heroes.length > 0"
                        :tag-group="descriptor.allies"
                        v-bind:class="{ selected : selectedPosition.isAlly}"
                >
                    <TagGroupHeroes :tag-group="descriptor.allies"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        :tag-group="descriptor.allies"
                        v-hammer:tap="() => (selecting = 'ally')"
                        v-bind:class="{ selected : selectedPosition.isAlly}"
                />
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-hammer:tap="() => $emit('enemyTap')"
                :tag-group="descriptor.enemies"
        >
            <template slot="infix">VS</template>
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.enemies.heroes.length > 0"
                        :tag-group="descriptor.enemies"
                        v-bind:class="{ selected : selectedPosition.isEnemy}"
                >
                    <TagGroupHeroes :tag-group="descriptor.enemies"/>
                </TagGroupBackground>
                <TagGroupInvite
                        v-else
                        :tag-group="descriptor.enemies"
                        v-hammer:tap="() => (selecting = 'enemy')"
                        v-bind:class="{ selected : selectedPosition.isEnemy}"
                />
            </template>
        </TagGroupFrame>
    </div>
</template>

<script>
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
import GamerPositionVso from "@/js/vso/GamerPositionVso";
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
            TagGroupBackground,
            TagGroupFrame,
            TagGroupInvite,
            TagGroupHeroes,
        },
    };

</script>

<style lang="scss" scoped>
    @import "~@/assets/css/tags.scss";

    .wrap {
        font-size: 0;

        & > * {
            font-size: 1rem;
        }
    }

    .invite, .tag-type-background {
        cursor: pointer;
    }
    .invite {
        opacity: .8;
    }

    .selected {
        animation: 1.1s ease-in-out infinite selected-group-animation;
        $animation-main-color: black;
        @keyframes selected-group-animation {
            0% {
                box-shadow: 0 0 .2em .2em $animation-main-color,
                0 0 .3em .35em white
            ;
            }
            50% {
                box-shadow:
                        0 0 .2em .15em $animation-main-color,
                        0 0 .3em .2em white
            ;
            }
            100% {
                box-shadow: 0 0 .2em .2em $animation-main-color,
                0 0 .3em .35em white
            ;
            }
        }
    }

    ::v-deep .tag-type-infix {
        color: white;
    }
</style>
