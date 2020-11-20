<template>
    <OverwatchPanel class="matchup-evaluations-page">
        <MatchupEvaluator
                :opposition-feed="feed"
                @evaluationsSaved="onEvaluationsSaved"
        />
        <div class="stats">
            <div>{{ evaluatedCount }} evaluated</div>
            <div>{{ skippedCount }} skipped</div>
            <div>{{ possibleEvaluationsCount - evaluatedCount - skippedCount }} left</div>
        </div>
        <OverwatchButton
                type="default"
                v-hammer:tap="() => showTableModal = true"
        >view all
        </OverwatchButton>
        <NotificationModalPopup
                v-if="showTableModal"
        >
            <div class="modal-content">
                <MatchupEvaluationsTable
                        @selectOpposition="onOppositionSelect"
                />
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => showTableModal = false"
                >Back
                </OverwatchButton>
            </div>
        </NotificationModalPopup>
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/evaluations/MatchupEvaluator.vue";
import RandomOppositionFeed from "@/ts/RandomOppositionFeed";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";
import MatchupEvaluationsTable
    from "@/vue/evaluations/MatchupEvaluationsTable.vue";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import {Watch} from "vue-property-decorator";
import HeroOpposition from "@/ts/vso/HeroOpposition";
import SingleOppositionFeed from "@/ts/SingleOppositionFeed";

@Component({
    components: {
        OverwatchButton,
        NotificationModalPopup,
        MatchupEvaluationsTable, OverwatchPanel, MatchupEvaluator
    },
})
export default class MatchupEvaluationsPage extends Vue {

    feed = new RandomOppositionFeed()

    service = MatchupEvaluatorService.instance

    showTableModal = false

    @Watch('showTableModal')
    onShowTableModalChange(newValue: boolean) {
        if (typeof window.orientation !== 'undefined') {
            if (newValue) {
                document.documentElement.requestFullscreen()
            } else {
                document.exitFullscreen()
            }
        }
    }

    onOppositionSelect(opposition: HeroOpposition) {
        this.feed = new SingleOppositionFeed(opposition)
        this.showTableModal = false
    }

    evaluatedCount = this.service.myEvaluatedOppositionsCount

    possibleEvaluationsCount = this.service.possibleEvaluationsCount

    skippedCount = this.service.skippedCount

    onEvaluationsSaved() {
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
    position: relative;

    .stats {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        white-space: nowrap;
        text-align: left;
        @include overwatch-futura;
        font-size: 1.5em;
        margin: 2em auto;
    }
}

.modal-content {
    max-height: 100vh;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    .matchup-evaluations {
        flex-shrink: 1;
        flex-basis: 50%;
        max-height: 50%;
        overscroll-behavior: contain;
    }

    button {
        min-height: 2em;
    }
}
</style>
