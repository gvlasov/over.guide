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
    var heroes = require('../js/heroes.js');
    var _ = require('lodash');
    module.exports = {
        methods: {
            flip: function () {
                alert('flip');
            },
            shuffle() {
                this.heroes.splice(0, this.heroes.length);
                var supports =
                    _.shuffle(heroes.filter(hero => hero.isSupport()))
                        .slice(0, 2);
                var tanks =
                    _.shuffle(heroes.filter(hero => hero.isTank()))
                        .slice(0, 2);
                var damage =
                    _.shuffle(heroes.filter(hero => hero.isDamage()))
                        .slice(0, 2);
                this.heroes.push(...tanks.concat(damage).concat(supports));
            }
        },
        data() {
            var self = this;
            return {
                heroes: Object.values(heroes).map(hero => new Hero(hero)),
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
