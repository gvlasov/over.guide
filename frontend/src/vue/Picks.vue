<template>
    <div>
        <ul>
            <HeroPortrait
                    v-for="hero in heroes"
                    :hero="hero"
                    :show-name="showName"
                    :onclick="onclick"
            />
        </ul>
    </div>
</template>

<script>
    import AllyPicksGenerator from "../js/AllyPicksGenerator";
    import HeroPortrait from "./HeroPortrait.vue";

    const generator = new AllyPicksGenerator();
    let shuffleCounter = 0;
    export default {
        methods: {
            shuffle() {
                this.setAllyPicks(
                    generator.generateSeeded(shuffleCounter++)
                )
            },
            /**
             * @param {AllyPicks} picks
             */
            setAllyPicks(picks) {
                this.heroes.splice(0, this.heroes.length);
                this.heroes.push(...picks.heroes);
            }
        },
        data() {
            const self = this;
            return {
                heroes: generator.generateSeeded(shuffleCounter - 1).heroes,
                showName: true,
                onclick: function () {
                    self.shuffle()
                }
            }
        },
        components: {
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>

</style>
