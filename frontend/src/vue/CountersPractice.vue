<template>
    <div>
        <Picks
                ref="enemyPicks"
                v-on:click.native="nextPick"
                :bans="bans"
        />
        <Picks
                ref="allyPicks"
                v-on:click.native="nextPick"
                :bans="bans"
        />
        <Roster
                ref="roster"
                :bans="bans"
        />
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Roster from '../vue/Roster.vue';
    import AllyPicksGenerator from "../js/AllyPicksGenerator";
    import BansGenerator from "../js/BansGenerator";
    import heroes from "../js/heroes";

    const bansGenerator = new BansGenerator();
    let shuffleCounter = 0;
    export default {
        methods: {
            nextPick() {
                const seed = shuffleCounter++;
                const bans = bansGenerator.generate(seed);
                this.bans = bans;
                const picksGenerator = new AllyPicksGenerator(bans);
                const picks = picksGenerator.generateSeeded(seed);
                this.setAllyPicks(picks);
                this.setEnemyPicks(picksGenerator.generateForRole(null, shuffleCounter));
                const disabledCategories = picks.getCompletelyPickedCategories();
                this.$refs.roster.enabledHeroes.splice(0, this.$refs.roster.enabledHeroes.length);
                let enabledHeroes = heroes.filter(
                    (hero) =>
                        !disabledCategories.includes(hero.role)
                        && !picks.heroes.includes(hero)
                );
                this.$refs.roster.enabledHeroes.push(
                    ...enabledHeroes
                );
                console.log(this.bans.map(it => it.name));
            },
            /**
             * @param {AllyPicks} picks
             */
            setAllyPicks(picks) {
                this.$refs.allyPicks.heroes.splice(0, picks.heroes.length);
                this.$refs.allyPicks.heroes.push(...picks.heroes);
            },
            /**
             * @param {AllyPicks} picks
             */
            setEnemyPicks(picks) {
                this.$refs.enemyPicks.heroes.splice(0, picks.heroes.length);
                this.$refs.enemyPicks.heroes.push(...picks.heroes);
            }
        },
        data() {
            const self = this;
            return {
                bans: []
            }
        },
        components: {
            Picks: Picks,
            Roster: Roster,
        },
    };

</script>

<style scoped>

</style>
