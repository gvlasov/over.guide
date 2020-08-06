<template>
    <div class="tag-group">
        <div
                v-for="hero in tagGroup.heroes"
                :key="hero.dataName"
                class="selected-hero-wrap"
        >
            <TagPortrait class="tag-portrait" :hero="hero"/>
            <div class="selected-hero-ability-icons-wrap">
                <AbilityIcon
                        v-for="ability in tagGroup.selectedAbilities(hero)"
                        :key="ability.dataName"
                        class="selected-hero-ability-icon"
                        :ability="ability"
                />
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
    }

    .selected-hero-wrap {
        border-spacing: 0;
        display: inline-block;
        position: relative;
    }

    .selected-hero-ability-icons-wrap {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .selected-hero-ability-icon {
        height: 1em;
        width: auto;
    }

    .tag-portrait ::v-deep .portrait {
        max-height: 3em;
    }
</style>