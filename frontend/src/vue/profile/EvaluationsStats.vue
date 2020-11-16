<template>
    <OverwatchPanelButton
            class="evaluation-stats"
            type="default"
    >
        <div class="images">
            <div
                    v-for="hero in heroes"
                    class="portrait-wrap"
            >
                <HeroPortrait
                        :hero="hero"
                        base-url="/images/roster-portraits/"
                />
            </div>
        </div>
        <div>
            My matchup evaluations
        </div>
        <div class="stats">
            {{ evaluatedCount }}/{{ possibleEvaluationsCount }}
        </div>
    </OverwatchPanelButton>
</template>

<script lang="ts">
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";
import HeroPortrait from "@/vue/HeroPortrait.vue";
import heroes from 'data/heroes'
import SeededShuffler from "data/generators/SeededShuffler";

@Component({
    components: {
        HeroPortrait,
        OverwatchPanelButton,
    },
})
export default class EvaluationsStats extends Vue {

    heroes =
        new SeededShuffler(new Date().getTime()).shuffle(
            Array.from(heroes.values())
        )

    get evaluatedCount(): number {
        return MatchupEvaluatorService.instance.myEvaluatedOppositionsCount
    }

    get possibleEvaluationsCount(): number {
        return MatchupEvaluatorService.instance.possibleEvaluationsCount
    }

};

</script>

<style lang="scss" scoped>
.evaluation-stats {
    width: 100%;
    height: 2em;

    & ::v-deep .content {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0;
        gap: .9em;
        height: 100%;
        text-shadow: 1px 1px #313333;

        .stats {
            flex-grow: 0;
        }

        .images {
            position: absolute;
            width: 100%;
            height: 2em;
            z-index: -1;
            opacity: .1;
            flex-shrink: 1;
            overflow: hidden;
            display: flex;
            line-height: 0;

            .portrait-wrap {
                position: relative;
                left: -.5em;
                width: 1.6em;
                .hero-portrait {
                    height: 2em;
                    width: auto;
                }
            }
        }
    }

}
</style>
