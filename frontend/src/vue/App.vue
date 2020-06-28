<template>
    <div class="app">
        <AdsensePlaceholder>AdSense</AdsensePlaceholder>
        <div>
            <RoleSelection/>
        </div>
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
    import Topic from "../js/Topic";
    import YoutubeExcerptEditor from "./YoutubeExcerptEditor.vue";
    import GuideEditor from "./GuideEditor.vue";
    import RoleSelection from "./RoleSelection";

    Vue.use(VueHammer);
    Vue.use(flexTouch);
    export default {
        methods: {},
        data() {

            const subject = heroes.find(h => h.dataName === 'pharah');
            const object = heroes.find(h => h.dataName === 'mei');
            return {
                subject: subject,
                object: object,
                topic: new Topic([subject, object]),
            };
        },
        components: {
            RoleSelection,
            GuideEditor,
            YoutubeExcerptEditor: YoutubeExcerptEditor,
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
