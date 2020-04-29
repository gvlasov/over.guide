<template>
    <li class="overwatch-font-shadowed hero">
        <img :src="imgSrc(hero)" v-on:click="onclick"/>
        <!--        <div v-if="showName" class="portrait-title">{{ hero.name }}</div>-->
    </li>
</template>

<script>
    var Hero = require('../js/Hero.js');
    module.exports = {
        name: 'HeroPortrait',
        props: {
            'hero': {
                type: Hero
            },
            'show-name': Boolean,
            onclick: {
                type: Function,
                default: function () {

                }
            },
        },
        methods: {
            /**
             * @param {Hero|String} hero
             */
            imgSrc(hero) {
                if (hero === null) {
                    return '/images/undefined-hero.png'
                } else {
                    return "https://d1u1mce87gyfbn.cloudfront.net/hero/" + hero.imgName + "/hero-select-portrait.png"
                }
            },
        },
        data() {
            return {}
        },
    };

</script>

<style scoped>
    @import '../css/fonts.css';

    .portrait-title {
        position: absolute;
        bottom: 0;
        color: white;
        text-shadow: 0 0 4px black;
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

    .hero > img {
        width: 100%;
    }
</style>
