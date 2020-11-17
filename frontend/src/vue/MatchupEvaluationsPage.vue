<template>
    <OverwatchPanel class="matchup-evaluations-page">
        <MatchupEvaluator
                :opposition-feed="feed"
        />
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/MatchupEvaluator.vue";
import RandomOppositionFeed from "@/ts/RandomOppositionFeed";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";

@Component({
    components: {OverwatchPanel, MatchupEvaluator},
})
export default class MatchupEvaluationsPage extends Vue {

    feed = new RandomOppositionFeed()

}

</script>

<style lang="scss" scoped>
.matchup-evaluations-page {
    padding: 1em;
    overflow: hidden;
}
</style>
