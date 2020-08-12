<template>
    <div class="app">
        <div>
            <router-link to="/counters-practice">Counters practice</router-link>
            <router-link to="/suggest-pick">Suggest pick</router-link>
            <router-link to="/guide-editor">Guide editor</router-link>
            <router-link to="/testing-ground">Testing ground</router-link>
            <router-link to="/search">Search</router-link>
            <BattlenetAuthButton/>
        </div>
        <AdsensePlaceholder>AdSense</AdsensePlaceholder>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import CountersPractice from '@/vue/training/CountersPractice.vue';
    import AdsensePlaceholder from "@/vue/AdsensePlaceholder.vue";
    import PickSuggestion from "@/vue/training/PickSuggestion.vue";
    import Vue from 'vue';
    import {VueHammer} from 'vue2-hammer';
    import flexTouch from 'vue-flex-touch';
    import MatchupEvaluation from "@/vue/MatchupEvaluation.vue";

    import heroes from "data/heroes";
    import Topic from "@/js/Topic";
    import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor.vue";
    import GuideEditor from "@/vue/guides/GuideEditor.vue";
    import RoleSelection from "@/vue/training/RoleSelection.vue";
    import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
    import MatchupEvaluator from "@/vue/MatchupEvaluator";

    Vue.use(VueHammer);
    Vue.use(flexTouch);
    export default {
        methods: {},
        data() {

            const subject = heroes.get('pharah');
            const object = heroes.get('mei');
            return {
                subject: subject,
                object: object,
                topic: new Topic([subject, object]),
            };
        },
        components: {
            MatchupEvaluator,
            BattlenetAuthButton,
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
        min-height: 100vh;
        overflow-x: hidden;
    }
</style>
