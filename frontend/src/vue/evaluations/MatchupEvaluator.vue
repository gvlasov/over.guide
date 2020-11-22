<template>
    <div class="matchup-evaluator">
        <div
                v-if="!hasMoreSuggestions"
                class="no-more"
        >
            <div class="text">No more</div>
        </div>
        <div
                v-else
                class="evaluations"
                @wheel="onWheel"
        >
            <transition-group
                    tag="div"
                    class="evaluations-list"
                    name="evaluations"
                    v-hammer:swipe="onSwipe"
            >
                <MatchupEvaluation
                        v-for="indexedEvaluation in showingEvaluationsIndexed"
                        :key="indexedEvaluation.evaluation.opposition.right.id+'_'+indexedEvaluation.evaluation.opposition.left.id"
                        :evaluation="indexedEvaluation.evaluation"
                        :hovered-score="evaluationIndex === indexedEvaluation.index ? hoveredScore : null"
                        v-hammer:tap="() => onEvaluationTap(indexedEvaluation)"
                        v-bind:class="{current: indexedEvaluation.index === evaluationIndex}"
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
                    :disabled="!hasMoreSuggestions"
            >
                <font-awesome-icon
                        v-if="option.icon !== null"
                        :icon="option.icon"
                />
                <span
                        v-else
                        style="position:relative; top: -.04em;"
                >ok</span>
            </MatchupEvaluationButton>
        </div>
        <transition name="mischief">
            <div
                    v-if="hasMischief"
                    class="mischief-notification"
            >
                <OverwatchPanelButton
                        type="main"
                        class="undo-mischief-button"
                        v-hammer:tap="undo"
                >I was messing around<br/> undo last {{ evaluations.length - 1 }} evaluations
                </OverwatchPanelButton>
            </div>
        </transition>
        <div
                v-if="currentEvaluation !== null"
                class="footer"
        >
            <OverwatchPanelButton
                    v-if="currentEvaluation.score === null"
                    type="default"
                    class="skip"
                    v-hammer:tap="() => onOptionTap(MatchupEvaluatorService.instance.dontKnowOption)"
            >skip
            </OverwatchPanelButton>
            <OverwatchPanelButton
                    v-else-if="currentEvaluation.score !== null"
                    type="default"
                    class="clear"
                    v-hammer:tap="() => onOptionTap(MatchupEvaluatorService.instance.clearOption)"
            >clear
            </OverwatchPanelButton>
            <slot name="right-button">
                <OverwatchPanelButton
                        type="default"
                        v-hammer:tap="tryMoveToPrevious"
                        :disabled="evaluationIndex === 0"
                >prev
                </OverwatchPanelButton>
                <OverwatchPanelButton
                        type="default"
                        v-hammer:tap="tryMoveToNext"
                        :disabled="isAtEnd"
                >next
                </OverwatchPanelButton>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";
import HeroPortrait from "@/vue/HeroPortrait.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import MatchupEvaluatorService, {EvaluationOption} from "@/ts/MatchupEvaluatorService";
import OppositionFeed, {FeedEndState} from "@/ts/OppositionFeed";
import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import MatchupEvaluation from "@/vue/evaluations/MatchupEvaluation.vue";
import MatchupEvaluationButton
    from "@/vue/evaluations/MatchupEvaluationButton.vue";
import MatchupEvaluationBatcher from "@/ts/MatchupEvaluationBatcher";

type IndexedEvaluation = {
    evaluation: MatchupEvaluationVso,
    index: number,
};

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

    evaluations: MatchupEvaluationVso[] = this.initialEvaluations

    get initialEvaluations(): MatchupEvaluationVso[] {
        const opposition = this.oppositionFeed.getNext()
        if (opposition === FeedEndState.End || opposition === FeedEndState.ThatWasOnly) {
            return []
        } else {
            return [
                new MatchupEvaluationVso(
                    opposition,
                    MatchupEvaluatorService.instance.getScore(
                        opposition
                    )
                )
            ]
        }
    }

    @Watch('MatchupEvaluatorService.instance.changed')
    onDataDownload() {
        this.$emit('evaluationsLoaded')
    }

    @Watch('oppositionFeed')
    onOppositionFeedChange(newValue: OppositionFeed) {
        this.reset()
    }

    reset() {
        this.evaluations = this.initialEvaluations
        this.evaluationIndex = 0
        this.hoveredScore = null
        this.addTimes.splice(0, this.addTimes.length)
    }

    evaluationIndex: number = 0

    hoveredScore = null

    get hasMoreSuggestions(): boolean {
        return this.evaluations.length > 0
    }

    showingEvaluationsMaxCount = 2

    batcher = new MatchupEvaluationBatcher()

    addTimes: number[] = []

    addTimesLookupDepth = 10

    onSwipe(event) {
        if (event.overallVelocityY > 0.2) {
            this.tryMoveToPrevious()
        } else if (event.overallVelocityY < -0.2) {
            this.tryMoveToNext()
        } else {
        }
    }

    get showingEvaluationsIndexed(): IndexedEvaluation[] {
        const start = Math.max(this.evaluationIndex - this.showingEvaluationsMaxCount + 1, 0);
        const end = this.evaluationIndex + 1;
        return this.evaluations
            .slice(start, end)
            .map((evaluation, index) => {
                return {evaluation, index: start + index}
            })
    }

    get isAtEnd(): boolean {
        return this.evaluationIndex === this.evaluations.length - 1
    }

    get currentEvaluation(): MatchupEvaluationVso | null {
        if (this.evaluations.length === 0) {
            return null
        } else {
            return this.evaluations[this.evaluationIndex]
        }
    }

    onOptionTap(option: EvaluationOption) {
        const currentEvaluation = this.currentEvaluation
        if (currentEvaluation === null) {
            return
        }
        if (currentEvaluation.score !== option.score) {
            currentEvaluation.score = option.score;
            this.batcher.add(currentEvaluation)
            this.addTimes.push(new Date().getTime())
            this.addTimes.splice(
                0,
                this.addTimes.length,
                ...this.addTimes.slice(-this.addTimesLookupDepth)
            )
            this.sendEvaluations()
            if (this.evaluationIndex === this.evaluations.length - 1) {
                this.moveToNextAfterEnd()
            } else {
                this.evaluations.splice(this.evaluationIndex, 1)
                this.evaluations.splice(this.evaluations.length - 1, 0, currentEvaluation)
                this.evaluationIndex = this.evaluations.length - 1
            }
        }
    }

    async sendEvaluations(): Promise<void> {
        const evaluation = this.currentEvaluation
        if (evaluation === null) {
            throw new Error()
        }
        return this.batcher.sendDebounced(
            () => {
                this.$emit('evaluationsSaved')
            }
        )
    }

    get hasMischief(): boolean {
        let fastCount = 0;
        for (let i = 1; i < this.addTimes.length; i++) {
            if (this.addTimes[i] - this.addTimes[i - 1] < MatchupEvaluationBatcher.debounceTimeMs) {
                fastCount++
                if (fastCount > 2) {
                    return true
                }
            }
        }
        return false
    }

    undo() {
        this.batcher.undo()
            .then(() => {
                this.$emit('evaluationsSaved')
            })
        this.reset()
    }

    onEvaluationTap(indexedEvaluation: IndexedEvaluation) {
        if (this.evaluationIndex === indexedEvaluation.index) {
            return
        }
        this.tryMoveToPrevious()
    }

    onWheel(event: WheelEvent) {
        event.preventDefault()
        if (event.deltaY > 0) {
            this.tryMoveToNext()
        } else {
            this.tryMoveToPrevious()
        }
    }

    tryMoveToPrevious() {
        if (this.evaluationIndex > 0) {
            this.evaluationIndex--
        }
    }

    tryMoveToNext() {
        if (this.evaluationIndex < this.evaluations.length - 1) {
            this.evaluationIndex++
        }
    }

    moveToNextAfterEnd() {
        if (this.evaluationIndex < this.evaluations.length - 1) {
            this.evaluationIndex = this.evaluations.length - 1;
        } else {
            this.evaluationIndex = this.evaluations.length;
        }
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
        } else {
            this.evaluations.push(
                new MatchupEvaluationVso(
                    opposition,
                    MatchupEvaluatorService.instance.getScore(opposition)
                )
            )
        }
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
        user-select: none;
        overscroll-behavior: contain;

        .evaluations-list {
            position: absolute;
            bottom: 0;
            width: 100%;

            .matchup-evaluation {
                width: 100%;
                opacity: .5;
                transform: scale(.7);
                transition: opacity .2s, max-height .2s, transform .2s;
                cursor: pointer;

                &:hover {
                    opacity: .65;
                    transform: scale(.73);
                }


                &.evaluations-enter, &.evaluations-leave-to {
                    opacity: 0;
                    max-height: 0;
                    transform: scale(.9);
                }

                &.evaluations-enter-active:last-child, &.evaluations-leave-active:last-child {
                    //overflow: hidden;
                }

                &.evaluations-enter-to, &.evaluations-leave {
                    opacity: 1;
                    max-height: 8em;
                }


                &.current {
                    opacity: 1;
                    transform: scale(1);
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
        gap: 2%;
        width: 100%;

        button {
            flex-grow: 1;
            flex-shrink: 0;

            & ::v-deep .content {
                padding: .2em .4em;
            }
        }
    }

    .mischief-notification {
        padding-top: 1em;
        overflow: visible;

        &.mischief-enter, &.mischief-leave-to {
            padding-top: 0;
            max-height: 0;
        }

        &.mischief-leave, &.mischief-enter-to {
            padding-top: 1em;
            max-height: 10em;
        }

        &.mischief-enter-active, &.mischief-appear-active {
            transition: padding-top .2s, max-height .2s;
            overflow: hidden;
        }
    }

    .footer {
        display: flex;
        justify-content: stretch;
        width: 100%;
        padding-top: 1.5em;
        gap: 2%;

        button {
            flex-shrink: 1;
            flex-basis: 19%;

            &:first-child {
                flex-basis: 60%;
            }
        }

        .skip, .clear {
            & ::v-deep .background {
                background-color: hsla(38, 56%, 58%, .8);
            }
        }
    }

}
</style>
