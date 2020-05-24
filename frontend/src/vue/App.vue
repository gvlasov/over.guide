<template>
    <fullscreen ref="fullscreen">
        <div class="app">
            <div class="fullscreen-button" @click="goFullscreen"></div>
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
            goFullscreen() {
                this.$refs['fullscreen'].toggle();
                screen.orientation.lock('landscape');
            }
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

    .fullscreen-button {
        position: fixed;
        display: inline-block;
        top: 1em;
        right: 1em;
        background-color: #ffffff00;
        background-image: url("/images/technology.svg");
        background-size: 100%;
        width: 4em;
        height: 4em;
    }
</style>
