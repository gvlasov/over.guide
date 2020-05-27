<template>
    <fullscreen ref="fullscreen">
        <div class="app">
            <AdsensePlaceholder>AdSense</AdsensePlaceholder>
            <CountersPractice/>
        </div>
    </fullscreen>
</template>

<script>
    import CountersPractice from '../vue/CountersPractice.vue';
    import fullscreen from 'vue-fullscreen';
    import Vue from 'vue';
    import {VueHammer} from 'vue2-hammer';
    import flexTouch from 'vue-flex-touch';
    import AdsensePlaceholder from "./AdsensePlaceholder.vue";

    Vue.use(fullscreen);
    Vue.use(VueHammer);
    Vue.use(flexTouch);
    export default {
        methods: {
        },
        components: {
            CountersPractice: CountersPractice,
            AdsensePlaceholder: AdsensePlaceholder,
        },
    }
</script>

<style scoped>
    .app {
        text-align: center;
        background-color: #405275;
        width: 100%;
        height: 100%;
    }
</style>
