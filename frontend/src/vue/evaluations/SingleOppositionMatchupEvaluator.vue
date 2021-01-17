<template>
    <MatchupEvaluator
            :opposition-feed="feed"
    >
        <OverwatchPanelButton
                slot="right-button"
                type="default"
                v-hammer:tap="() => $emit('back')"
                style="flex-basis: 39%;"
        >Close</OverwatchPanelButton>
    </MatchupEvaluator>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/evaluations/MatchupEvaluator.vue";
import SingleOppositionFeed from "@/ts/SingleOppositionFeed";
import {Prop} from "vue-property-decorator";
import HeroOpposition from "@/ts/vso/HeroOpposition";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";

@Component({
    components: {
        OverwatchPanelButton,
        MatchupEvaluator,
    },
})
export default class SingleOppositionMatchupEvaluator extends Vue {
    @Prop({required: true})
    opposition: HeroOpposition

    feed = new SingleOppositionFeed(this.opposition)
}
</script>

<style lang="scss" scoped>
.matchup-evaluator {
    max-height: 11.1em;
}
</style>
