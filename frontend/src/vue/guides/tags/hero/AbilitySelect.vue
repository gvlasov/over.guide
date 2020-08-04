<template>
    <div class="grid">
        <AbilityCheckbox
                v-for="ability in abilities"
                :model-value="selectedAbilities"
                @change="($event)=>$emit('selectedAbilitiesChange', $event)"
                :value="ability"
                :key="ability.id"
                class="ability"
        />
    </div>
</template>

<script>
    import abilities from 'data/abilities';
    import AbilityCheckbox from "@/vue/guides/tags/hero/AbilityCheckbox";
    import AbilityVso from "@/js/vso/AbilityVso";


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
            heroes: {
                type: Array,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {
        },
        computed: {
            /**
             * @return {AbilityVso[]}
             */
            abilities() {
                const allAbilities = Array.from(abilities.values());
                return this.heroes.flatMap(
                    hero => allAbilities.filter(ability => ability.heroId === hero.id)
                )
                    .map(it => new AbilityVso(it))
            }
        },
        components: {
            AbilityCheckbox,
        },
    };

</script>

<style scoped>
    @import "~@/assets/css/fonts.css";

    /*.grid {*/
    /*    display: grid;*/
    /*    grid-template-columns: repeat(4, max-content);*/
    /*}*/
    .grid {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .ability {
        margin: .2rem;
    }

</style>
