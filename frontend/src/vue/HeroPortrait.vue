<template>
    <img :src="imgSrc(hero)"/>
</template>

<script>
    import Hero from "../js/Hero.js";

    export default {
        name: 'HeroPortrait',
        props: {
            'hero': {
                type: Hero
            },
            'baseUrl': {
                type: String,
                default: '/images/hero-portraits'
            }
        },
        methods: {
            /**
             * @param {Hero|String} hero
             */
            imgSrc(hero) {
                if (hero === null) {
                    return '/images/undefined-hero.png'
                } else {
                    return this.baseUrl + '/' + hero.imgName + ".png"
                }
            },
        },
        data() {
            return {}
        },
    };

</script>

<style scoped>
    img {
        width: 100%;
    }
</style>
