<template>
    <div class="matchup-evaluator">
        <div
                v-if="noMoreSuggestions"
                class="no-more"
        >
            <div class="text">No more</div>
        </div>
        <div
                v-else
                class="evaluations"
        >
            <transition-group
                    tag="div"
                    class="evaluations-list"
                    name="evaluations"
            >
                <MatchupEvaluation
                        v-for="(evaluation, index) in showingEvaluations"
                        :key="evaluation.opposition.right.id+'_'+evaluation.opposition.left.id"
                        :evaluation="evaluation"
                        :hovered-score="evaluationIndex === index ? hoveredScore : null"
                />
            </transition-group>
        </div>
        <div
                class="options"
                @mouseleave="() => hoveredScore = null"
        >
            <MatchupEvaluationButton
                    v-for="option in MatchupEvaluatorService.instance.options"
                    :key="option.score"
                    class="option"
                    :class-suffix="option.classSuffix"
                    v-hammer:tap="() => onOptionTap(option)"
                    @mouseover.native="() => hoveredScore = option.score"
                    :disabled="noMoreSuggestions"
            >
                <font-awesome-icon :icon="option.icon"/>
            </MatchupEvaluationButton>
        </div>
        <div class="footer">
            <OverwatchPanelButton
                    type="default"
                    class="i-dont-know"
                    v-hammer:tap="() => onOptionTap(MatchupEvaluatorService.instance.dontKnowOption)"
            >I don't know
            </OverwatchPanelButton>
            <OverwatchPanelButton
                    type="default"
                    v-hammer:tap="() => $emit('back')"
            >Back
            </OverwatchPanelButton>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import HeroPortrait from "./HeroPortrait.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import MatchupEvaluatorService, {EvaluationOption} from "@/ts/MatchupEvaluatorService";
import OppositionFeed, {FeedEndState} from "@/ts/OppositionFeed";
import HeroOpposition from "@/ts/vso/HeroOpposition";
import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import MatchupEvaluation from "@/vue/MatchupEvaluation.vue";
import MatchupEvaluationButton from "@/vue/MatchupEvaluationButton.vue";

@Component({
    components: {
        MatchupEvaluationButton,
        MatchupEvaluation,
        OverwatchButton,
        OverwatchPanelButton,
        HeroPortrait,
    }
})
export default class MatchupEvaluator extends Vue {

    MatchupEvaluatorService = MatchupEvaluatorService

    @Prop({required: true})
    oppositionFeed: OppositionFeed

    evaluations: MatchupEvaluationVso[] = [
        new MatchupEvaluationVso(
            this.oppositionFeed.getNext() as HeroOpposition,
            null
        )
    ]

    evaluationIndex: number = 0

    hoveredScore = null

    noMoreSuggestions = false

    showingEvaluationsMaxCount = 3

    get showingEvaluations(): MatchupEvaluationVso[] {
        return this.evaluations.slice(
            Math.max(this.evaluationIndex - this.showingEvaluationsMaxCount + 1, 0),
            this.evaluationIndex + 1
        );
    }

    get currentEvaluation(): MatchupEvaluationVso {
        return this.evaluations[this.evaluationIndex]
    }

    onOptionTap(option: EvaluationOption) {
        if (this.currentEvaluation.score !== option.score) {
            this.currentEvaluation.score = option.score
            this.moveToNext()
        }
    }

    moveToNext() {
        this.evaluationIndex++
        if (this.evaluationIndex >= this.evaluations.length) {
            const oldLength = this.evaluations.length
            this.loadNextMatchup()
            const newLength = this.evaluations.length
            if (oldLength === newLength) {
                this.evaluationIndex--
            }
        }
    }

    loadNextMatchup() {
        const opposition = this.oppositionFeed.getNext();
        if (opposition === FeedEndState.ThatWasOnly) {

        } else if (opposition === FeedEndState.End) {
            this.noMoreSuggestions = true
        } else {
            this.evaluations.push(
                new MatchupEvaluationVso(
                    opposition,
                    MatchupEvaluatorService.instance.getScore(opposition)
                )
            )
        }
    }

    async createEvaluation(evaluation: MatchupEvaluationVso) {
        this.$emit('evaluate', evaluation.score)
        if (evaluation.score === null) {
            throw new Error()
        }
        return MatchupEvaluatorService.instance.evaluateMatchup(
            evaluation.opposition.left,
            evaluation.opposition.right,
            evaluation.score
        )
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.matchup-evaluator {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    box-shadow: 0 0 0 transparent;
    transition: box-shadow .13s, background-color .13s;
    max-width: 100vw;
    font-size: 1.5em;
    overflow: visible;

    .evaluations {
        flex-grow: 1;
        height: 10em;
        position: relative;
        overflow: hidden;

        .evaluations-list {
            position: absolute;
            bottom: 0;
            width: 100%;

            .matchup-evaluation {
                overflow: hidden;
                width: 100%;

                &.evaluations-enter, &.evaluations-leave-to {
                    opacity: 0;
                    max-height: 0;
                }

                &.evaluations-enter-to, &.evaluations-leave {
                    opacity: 1;
                    max-height: 8em;
                }

                &.evaluations-enter-active, .evaluations-leave-active {
                    transition: opacity .5s, max-height .5s;
                }

            }
        }
    }

    .no-more {
        font-family: BigNoodleTooOblique, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            font-size: 2em;
        }

        height: 5em;
    }

    .options {
        display: flex;
        justify-content: stretch;
        max-width: 30em;
        margin: 0 auto;
        padding-top: 1em;
        gap: .4em;
        width: 100%;

        button {
            flex-grow: 1;
            flex-shrink: 0;

            & ::v-deep .content {
                padding: .2em .4em;
            }
        }
    }

    .footer {
        display: flex;
        justify-content: stretch;
        width: 100%;
        padding-top: 2em;
        gap: 1em;

        button {
            flex-grow: 1;
            flex-shrink: 0;
        }

        .i-dont-know {
            & ::v-deep .background {
                background-color: hsla(38, 56%, 58%, .8);
            }
        }
    }

}
</style>
