<template>
        <div class="app">
            <AdsensePlaceholder>AdSense</AdsensePlaceholder>
            <PickSuggestion/>
        </div>
</template>

<script>
    import CountersPractice from '../vue/CountersPractice.vue';
    import AdsensePlaceholder from "./AdsensePlaceholder.vue";
    import PickSuggestion from "./PickSuggestion.vue";
    import Vue from 'vue';
    import {VueHammer} from 'vue2-hammer';
    import flexTouch from 'vue-flex-touch';

    Vue.use(VueHammer);
    Vue.use(flexTouch);
    export default {
        methods: {
        },
        components: {
            CountersPractice: CountersPractice,
            AdsensePlaceholder: AdsensePlaceholder,
            PickSuggestion: PickSuggestion,
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
