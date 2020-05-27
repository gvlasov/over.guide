<template>
    <fullscreen ref="fullscreen">
        <div class="app">
            <h1 class="overwatch-font-shadowed">Overwatch Counters</h1>
            <CountersPractice/>
            <!--        <Roster :on-hero-click="heroTest"/>-->
        </div>
    </fullscreen>
</template>

<script>
    import CountersPractice from '../vue/CountersPractice.vue';
    import fullscreen from 'vue-fullscreen';
    import Vue from 'vue';
    import {VueHammer} from 'vue2-hammer';

    Vue.use(fullscreen);
    Vue.use(VueHammer);
    export default {
        methods: {
        },
        components: {
            CountersPractice: CountersPractice,
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
