<template>
    <OverwatchPanel class="matchup-evaluations-page">
        <MatchupEvaluator
                :opposition-feed="feed"
                @evaluationSaved="onEvaluationSaved"
        />
        <div class="stats">
            <div>{{ evaluatedCount }} evaluated</div>
            <div>{{ skippedCount }} skipped</div>
            <div>{{ possibleEvaluationsCount - evaluatedCount - skippedCount }} left</div>
        </div>
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/evaluations/MatchupEvaluator.vue";
import RandomOppositionFeed from "@/ts/RandomOppositionFeed";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";

@Component({
    components: {OverwatchPanel, MatchupEvaluator},
})
export default class MatchupEvaluationsPage extends Vue {

    feed = new RandomOppositionFeed()

    service = MatchupEvaluatorService.instance

    evaluatedCount = this.service.myEvaluatedOppositionsCount

    possibleEvaluationsCount = this.service.possibleEvaluationsCount

    skippedCount = this.service.skippedCount

    onEvaluationSaved() {
        this.updateNonReactive()
    }

    updateNonReactive() {
        this.evaluatedCount = this.service.myEvaluatedOppositionsCount
        this.possibleEvaluationsCount = this.service.possibleEvaluationsCount
        this.skippedCount = this.service.skippedCount
    }


}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.matchup-evaluations-page {
    padding: 1em;
    overflow: hidden;

    .stats {
        width: 5em;
        white-space: nowrap;
        text-align: left;
        @include overwatch-futura;
        font-size: 1.5em;
        margin: 0 auto;
    }
}
</style>
