<template>
    <li class="overwatch-font-shadowed hero">
        <img :src="imgSrc(hero)"/>
        <!--        <div v-if="showName" class="portrait-title">{{ hero.name }}</div>-->
    </li>
</template>

<script>
    import Hero from "../js/Hero.js";

    export default {
        name: 'HeroPortrait',
        props: {
            'hero': {
                type: Hero
            },
            'show-name': Boolean,
        },
        methods: {
            /**
             * @param {Hero|String} hero
             */
            imgSrc(hero) {
                if (hero === null) {
                    return '/images/undefined-hero.png'
                } else {
                    return "/images/hero-portraits/" + hero.imgName + ".png"
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
