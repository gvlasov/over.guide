<template>
    <div class="app">
        <Navigation/>
        <router-view></router-view>
    </div>
</template>

<script>
    import CountersPractice from '@/vue/training/CountersPractice.vue';
    import AdsensePlaceholder from "@/vue/AdsensePlaceholder.vue";
    import PickSuggestion from "@/vue/training/PickSuggestion.vue";
    import MatchupEvaluation from "@/vue/MatchupEvaluation.vue";

    import heroes from "data/heroes";
    import Topic from "@/js/Topic";
    import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor.vue";
    import GuideEditor from "@/vue/guides/GuideEditor.vue";
    import RoleSelection from "@/vue/training/RoleSelection.vue";
    import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
    import MatchupEvaluator from "@/vue/MatchupEvaluator";
    import Navigation from "@/vue/Navigation";

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
            Navigation,
        },
    }
</script>

<style scoped>
    .app {
        text-align: center;
        background-color: #405275;
        width: min-content;
        margin: 0 auto;
        min-height: 100vh;
        overflow-x: hidden;
    }
</style>
