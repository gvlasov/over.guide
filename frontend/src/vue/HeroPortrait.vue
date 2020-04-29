<template>
    <li class="overwatch-font-shadowed hero">
        <img :src="hero.imgSrc()" v-on:click="onclick"/>
        <div v-if="showName" class="portrait-title">{{ hero.name }}</div>
    </li>
</template>

<script>
    var Hero = require('../js/Hero.js');
    module.exports = {
        name: 'HeroPortrait',
        props: {
            'hero': Hero,
            'show-name': Boolean,
            onclick: {
                type: Function,
                default: function () {

                }
            },
        },
        methods: {

        },
        data() {
            return {
                onclick: function() { }
            }
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
</style>
