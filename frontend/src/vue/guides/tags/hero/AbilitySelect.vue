<template>
    <table>
        <AbilityCheckbox
                v-for="ability in abilities"
                :model-value="selectedAbilities"
                @change="($event)=>$emit('selectedAbilitiesChange', $event)"
                :value="ability"
                :key="ability.id"
        />
    </table>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import OverwatchButton from "@/vue/OverwatchButton";
    import TagBuilderRosterPortrait
        from "@/vue/guides/tags/hero/TagBuilderRosterPortrait";
    import abilities from 'data/abilities';
    import AbilityIcon from "@/vue/AbilityIcon";
    import AbilityCheckbox from "@/vue/guides/tags/hero/AbilityCheckbox";


    export default {
        model: {
            prop: 'selectedAbilities',
            event: 'selectedAbilitiesChange',
        },
        props: {
            selectedAbilities: {
                type: Array,
                required: true,
            },
            hero: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {
            /**
             * @param {AbilityDto} ability
             */
            onAbilityTap(ability) {
                if (typeof this.selectedAbilities.find(a => a.id === ability.id) !== 'undefined') {
                    this.$emit(
                        'selectedAbilitiesChange',
                        this.selectedAbilities.filter(a => a.id !== ability.id)
                    )
                } else {
                    this.$emit(
                        'selectedAbilitiesChange',
                        [...this.selectedAbilities, ability]
                    )
                }
            }
        },
        computed: {
            abilities() {
                return Array.from(abilities.values())
                    .filter(ability => ability.heroId === this.hero.id);
            }
        },
        components: {
            AbilityCheckbox,
            AbilityIcon,
            TagBuilderRosterPortrait,
            OverwatchButton,
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
        },
    };

</script>

<style scoped>
    @import "~@/assets/css/fonts.css";

    table {
        display: inline-table;
        border-spacing: 0 .9em;
        border: 0;
    }

</style>
