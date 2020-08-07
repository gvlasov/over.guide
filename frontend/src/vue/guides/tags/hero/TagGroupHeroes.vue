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

<style scoped>
    .tag-group {
        display: flex;
        gap: .22em;
        max-height: 3em;
    }

    .selected-hero-wrap {
        display: flex;
        border-spacing: 0;
        position: relative;
    }

    .ability-icons-wrap {
        writing-mode: vertical-lr;
        max-height: 3em;
        white-space: normal;
        background-color: #28253a;
        padding-left: .1em;
        border-radius: .3em 0 0 .3em;
        margin-right: -1px;
    }

    .ability-icon-wrap {
        display: inline-block;
    }

    .ability-icon {
        height: 1.4em;
        width: auto;
        margin: .05em;
    }

    .tag-portrait-single ::v-deep .portrait {
        max-height: 3em;
        border-radius: .3em .3em .3em .3em;
    }

    .tag-portrait-combined ::v-deep .portrait {
        max-height: 3em;
        border-radius: 0 .3em .3em 0;
    }
</style>