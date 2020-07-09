<template>
    <img
            :src="imgSrc(hero)"
            v-bind:data-hero-data-name="hero ? hero.dataName : ''"
    />
</template>

<script>
    import Hero from "data/dto/Hero";

    export default {
        name: 'HeroPortrait',
        props: {
            'hero': {
                type: Object,
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
                    return this.baseUrl + '/' + hero.dataName + ".png"
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
