<template>
    <div>
        <ul>
            <li class="overwatch-font-shadowed hero" v-for="hero in heroes">
                <img :src="hero.imgSrc()" v-on:click="shuffle"/>
                <div class="portrait-title">{{ hero.name }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    // var websocket = require('../js/websocket');
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
                    _.shuffle(heroes.filter(hero => hero.role === 'Support'))
                        .slice(0, 2)
                        .map(hero => new Hero(hero));
                var tanks =
                    _.shuffle(heroes.filter(hero => hero.role === 'Tank'))
                        .slice(0, 2)
                        .map(hero => new Hero(hero));
                var damage =
                    _.shuffle(heroes.filter(hero => hero.role === 'Damage'))
                        .slice(0, 2)
                        .map(hero => new Hero(hero));
                this.heroes.push(...tanks.concat(damage).concat(supports));
            }
        },
        data() {
            return {
                heroes: Object.values(heroes).map(hero => new Hero(hero))
            }
        }
    };

</script>

<style scoped>
    @import '../css/fonts.css';

    .portrait-title {
        position: absolute;
        bottom: 0px;
        color: white;
        text-shadow: 0px 0px 4px black;
        font-size: 2.4em;
        font-weight: bold;
        display: block;
        text-align: center;
        width: 100%;
    }

    .hero {
        position: relative;
        display: inline-block;
    }
</style>
