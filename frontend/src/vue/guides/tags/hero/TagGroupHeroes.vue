<template>
    <div class="tag-group">
        <div
                v-for="hero in tagGroup.heroes"
                :key="hero.dataName"
                class="selected-hero-wrap"
        >
            <TagPortrait class="tag-portrait" :hero="hero"/>
            <div class="ability-icons-wrap">
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
        padding-left: .1em;
    }

    .ability-icon-wrap {
        display: inline-block;
    }

    .ability-icon {
        height: 1em;
        width: auto;
        margin: .1em;
    }

    .tag-portrait ::v-deep .portrait {
        max-height: 3em;
    }
</style>