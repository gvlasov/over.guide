<template>
    <div class="app">
        <AdsensePlaceholder>AdSense</AdsensePlaceholder>
        <MatchupEvaluation
                :subject="subject"
                :object="object"
        />
    </div>
</template>

<script>
    import CountersPractice from '../vue/CountersPractice.vue';
    import AdsensePlaceholder from "./AdsensePlaceholder.vue";
    import PickSuggestion from "./PickSuggestion.vue";
    import Vue from 'vue';
    import {VueHammer} from 'vue2-hammer';
    import flexTouch from 'vue-flex-touch';
    import MatchupEvaluation from "./MatchupEvaluation.vue";
    import heroes from "../js/heroes";

    Vue.use(VueHammer);
    Vue.use(flexTouch);
    export default {
        methods: {},
        data() {
            return {
                subject: heroes.find(h => h.dataName === 'pharah'),
                object: heroes.find(h => h.dataName === 'mei')
            };
        },
        components: {
            MatchupEvaluation: MatchupEvaluation,
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
