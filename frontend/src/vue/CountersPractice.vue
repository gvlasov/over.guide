<template>
    <div>
        <Picks
                ref="allyPicks"
                v-on:click.native="nextPick"
        />
        <Roster
                ref="roster"
        />
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Roster from '../vue/Roster.vue';
    import AllyPicksGenerator from "../js/AllyPicksGenerator";
    import heroes from "../js/heroes";

    const generator = new AllyPicksGenerator();
    let shuffleCounter = 0;
    export default {
        methods: {
            nextPick() {
                let picks = generator.generateSeeded(shuffleCounter++);
                this.setAllyPicks(picks);
                let disabledCategories = picks.getCompletelyPickedCategories();
                this.$refs.roster.enabledHeroes.splice(0, this.$refs.roster.enabledHeroes.length);
                let enabledHeroes = heroes.filter(
                    (hero) =>
                        !disabledCategories.includes(hero.role)
                        && !picks.heroes.includes(hero)
                );
                this.$refs.roster.enabledHeroes.push(
                    ...enabledHeroes
                )
            },
            /**
             * @param {AllyPicks} picks
             */
            setAllyPicks(picks) {
                this.$refs.allyPicks.heroes.splice(0, picks.heroes.length);
                this.$refs.allyPicks.heroes.push(...picks.heroes);
            }
        },
        data() {
            const self = this;
            return {}
        },
        components: {
            Picks: Picks,
            Roster: Roster,
        },
    };

</script>

<style scoped>

</style>
