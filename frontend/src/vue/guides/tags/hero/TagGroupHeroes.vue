<template>
    <div class="tag-group">
        <div
                v-for="hero in tagGroup.heroes"
                :key="hero.dataName"
                class="selected-hero-wrap"
        >
            <div
                    v-if="tagGroup.selectedAbilities(hero).length > 0"
                    class="ability-icons-wrap"
                    ref="writingModeWrap"
            >
                <div
                        v-for="ability in tagGroup.selectedAbilities(hero)"
                        :key="ability.dataName"
                        class="ability-icon-wrap"
                >
                    <AbilityIcon
                            class="ability-icon"
                            :ability="ability"
                    />
                </div>
            </div>
            <TagPortrait
                    v-bind:class="tagGroup.selectedAbilities(hero).length === 0 ? 'tag-portrait-single' : 'tag-portrait-combined'"
                    :hero="hero"
            />
        </div>
    </div>
</template>

<script>
import TagGroupVso from "@/js/vso/TagGroupVso";
import AbilityIcon from "@/vue/AbilityIcon";
import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";

export default {
    props: {
        tagGroup: {
            type: TagGroupVso,
            required: true,
        }
    },
    data() {
        return {};
    },
    methods: {},
        computed: {},
        components: {
            AbilityIcon,
            TagPortrait,
        },
    };
</script>

<style lang="scss" scoped>
    @import '~@/assets/css/tags.scss';

    .tag-group {
        display: flex;
        gap: .22em;
        max-height: 3em;
    }

    .selected-hero-wrap {
        display: flex;
        border-spacing: 0;
        position: relative;
        background-color: rgba($tag-hero-bg-color, .8);
        border-radius: .4em;

        .ability-icons-wrap {
            /*writing-mode: vertical-lr;*/
            display: grid;
            direction: rtl;
            /*grid-template-columns: auto auto auto;*/
            grid-auto-flow: column dense;
            grid-template-rows: auto auto;
            grid-template-columns: auto auto auto auto;
            grid-gap: 0;
            max-height: 3em;
            white-space: normal;
            border-radius: .3em 0 0 .3em;
            padding-left: .2em;

            .ability-icon-wrap {
                display: inline-block;
                text-align: center;

                .ability-icon {
                    height: 1.3em;
                    width: auto;
                }
            }
        }

        .tag-portrait-single ::v-deep .portrait {
            max-height: 3em;
            border-radius: .3em .3em .3em .3em;
        }

        .tag-portrait-combined ::v-deep .portrait {
            max-height: 3em;
            border-radius: 0 .3em .3em 0;
        }
    }

</style>