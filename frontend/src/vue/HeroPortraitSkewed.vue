<template>
    <div class="skew">
        <HeroPortrait
                :hero="hero"
                :show-name="false"
                :onclick="onclick"
                style="width: 3em;"
                class="underlying"
        />
    </div>
</template>

<script>
    import Hero from '../js/Hero.js';
    import HeroPortrait from "./HeroPortrait.vue";

    export default {
        name: 'HeroPortraitSkewed',
        props: {
            'hero': Hero,
            'show-name': Boolean,
            onclick: {
                type: Function,
                default: function () {

                }
            },
        },
        methods: {},
        data() {
            return {}
        },
        components: {
            HeroPortrait: HeroPortrait,
        },
    };

</script>

<style scoped>
    .skew {
        position: relative;
        display: inline-block;
        -ms-transform: skew(-25deg, 0deg);
        -webkit-transform: skew(-25deg, 0deg);
        transform: skew(-25deg, 0deg);
        /*outline:1px solid #fff;*/
        overflow: hidden;
        border-radius: .4em;
        margin-right: .4em;
        border: 1px solid white;
        cursor: pointer;
    }

    .underlying {
        -ms-transform: skew(25deg, 0deg) scale(2.0);
        -webkit-transform: skew(25deg, 0deg) scale(2.0);
        transform: skew(25deg, 0deg) scale(2.0);
    }

    .skew:hover {
        transform: skew(-25deg, 0deg) scale(1.4);
        z-index: 9000;
        box-shadow: black 10px 10px 10px;
    }
</style>
