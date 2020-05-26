<template>
    <li class="overwatch-font-shadowed hero">
        <img :src="imgSrc(hero)"/>
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

    .hero {
        position: relative;
        display: inline-block;
    }

    .hero > img {
        width: 100%;
    }
</style>
