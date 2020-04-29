<template>
    <div>
        <ul class="tanks">
            <HeroPortraitSkewed
                    v-for="hero in tanks"
                    :hero="hero"
                    :onclick="onclick"
                    style="width: 3em;"
            />
        </ul>
        <ul class="damage">
            <HeroPortraitSkewed
                    v-for="hero in damage"
                    :hero="hero"
                    :onclick="onclick"
                    style="width: 3em;"
            />
        </ul>
        <ul class="supports">
            <HeroPortraitSkewed
                    v-for="hero in supports"
                    :hero="hero"
                    :onclick="onclick"
                    style="width: 3em;"
            />
        </ul>
    </div>
</template>

<script>
    var Hero = require('../js/Hero.js');
    var heroes = require('../js/heroes.js');
    module.exports = {
        methods: {},
        data() {
            var self = this;
            return {
                tanks:
                    heroes
                        .filter(hero => hero.role === 'Tank'),
                damage:
                    heroes
                        .filter(hero => hero.role === 'Damage'),
                supports:
                    heroes
                        .filter(hero => hero.role === 'Support'),
                showName: true,
                onclick: function () {

                }
            }
        },
        components: {
            HeroPortraitSkewed: require('../vue/HeroPortraitSkewed.vue'),
        },
    };

</script>

<style scoped>

</style>
