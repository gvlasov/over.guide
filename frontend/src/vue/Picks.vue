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
    var Hero = require('../js/Hero.js');
    var generator = new (require('../js/AllyPicksGenerator.js'));
    var heroes = require('../js/heroes.js');
    var _ = require('lodash');
    var shuffleCounter = 0;
    module.exports = {
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
            HeroPortrait: require('../vue/HeroPortrait.vue')
        },
    };

</script>

<style scoped>

</style>
