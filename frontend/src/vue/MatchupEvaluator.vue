<template>
    <div
            class="matchup-evaluator"
            v-bind:class="{sending: sending}"
    >
        <div
                v-if="noMoreSuggestions"
                class="no-more"
        >
            <div class="text">No more</div>
        </div>
        <div
                v-else
                class="opposition"
        >
            <HeroPortrait
                    :hero="opposition.left"
                    v-bind:style="{transform: `scale(${scale(coeff)})`}"
            />
            <div class="state">
                <div class="subject-name">
                    {{ opposition.left.name }}
                </div>
                <transition-group
                        tag="div"
                        name="remaining"
                        class="selected-option-wrap"
                        @mouseleave.native="() => {if (!isEvaluated) { coeff = 1.0}}"
                        v-bind:class="isEvaluated ? '' : 'empty'"
                >
                    <OverwatchPanelButton
                            v-for="option in options"
                            v-if="option.score === selectedScore"
                            :key="option.score"
                            type="default"
                            class="option"
                            v-bind:class="`matchup-${option.classSuffix}`"
                            @mouseover.native="() => {if (!isEvaluated) { coeff = option.coeff}}"
                            disabled="disabled"
                    >{{ option.label }}
                    </OverwatchPanelButton>
                </transition-group>
                <div
                        v-if="!isEvaluated"
                        class="no-selection"
                >VS
                </div>
                <div class="object-name">
                    {{ opposition.right.name }}
                </div>
            </div>
            <HeroPortrait
                    :hero="opposition.right"
                    v-bind:style="{transform: `scale(${scale(2-coeff)})`}"
            />
        </div>
        <div class="options">
            <OverwatchPanelButton
                    v-for="option in options"
                    :key="option.score"
                    type="default"
                    class="option"
                    v-bind:class="`matchup-${option.classSuffix}`"
                    v-hammer:tap="() => onOptionTap(option)"
                    @mouseover.native="() => {if (!isEvaluated) { coeff = option.coeff}}"
                    :disabled="noMoreSuggestions"
            >
                <font-awesome-icon :icon="option.icon"/>
            </OverwatchPanelButton>
        </div>
        <div class="footer">
            <OverwatchPanelButton
                    type="default"
                    class="i-dont-know"
                    v-hammer:tap="onDontKnowTap"
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
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import HeroOpposition from "@/ts/vso/HeroOpposition";

type Option = {
    score: number,
    label: string,
    shortLabel: string,
    icon: string,
    classSuffix: string,
    coeff: number,
}

@Component({
    components: {
        OverwatchButton,
        OverwatchPanelButton,
        HeroPortrait,
    }
})
export default class MatchupEvaluator extends Vue {
    @Prop({required: true})
    initialOpposition: HeroOpposition|null

    opposition = this.initialOpposition ?? MatchupEvaluatorService.instance.getRandomUnevaluatedOpposition()

    coeff: number = 1.0

    get selectedScore(): MatchupEvaluationUserScore | null {
        return this.opposition === null
            ? null
            : MatchupEvaluatorService.instance.getScore(this.opposition.left, this.opposition.right);
    }

    sending = false

    get noMoreSuggestions() : boolean {
        return this.opposition === null
    }

    options: Option[] = [
        {
            score: MatchupEvaluationUserScore.HardCounters,
            label: 'hard counters',
            shortLabel: '<<',
            icon: 'angle-double-left',
            classSuffix: 'hard-counters',
            coeff: 1.5,
        },
        {
            score: MatchupEvaluationUserScore.Counters,
            label: 'counters',
            shortLabel: '<',
            icon: 'angle-left',
            classSuffix: 'counters',
            coeff: 1.3,
        },
        {
            score: MatchupEvaluationUserScore.Ok,
            label: 'is ok against',
            shortLabel: '=',
            icon: 'circle',
            classSuffix: 'ok',
            coeff: 1.0,
        },
        {
            score: MatchupEvaluationUserScore.Countered,
            label: 'countered by',
            icon: 'angle-right',
            shortLabel: '>',
            classSuffix: 'countered',
            coeff: 0.7,
        },
        {
            score: MatchupEvaluationUserScore.HardCountered,
            label: 'hard countered by',
            icon: 'angle-double-right',
            shortLabel: '>>',
            classSuffix: 'hard-countered',
            coeff: 0.5,
        },
    ]

    get isEvaluated(): boolean {
        return this.selectedScore !== null &&
            this.selectedScore !== MatchupEvaluationUserScore.DontKnow;
    }

    scale(coeff: number) {
        if (coeff < 1) {
            return coeff + (1 - coeff) * 0.8
        } else {
            return coeff
        }
    }

    onOptionTap(option: Option) {
        if (this.selectedScore !== option.score) {
            this.selectOption(option)
            this.loadNextMatchup()
        }
    }

    onDontKnowTap() {
        if (this.selectedScore !== MatchupEvaluationUserScore.DontKnow) {
            this.createEvaluation(MatchupEvaluationUserScore.DontKnow)
            this.loadNextMatchup()
        }
    }

    loadNextMatchup() {
        this.opposition = MatchupEvaluatorService.instance.getRandomUnevaluatedOpposition()
    }

    async selectOption(option: Option) {
        this.coeff = option.coeff
        return this.createEvaluation(option.score)
    }

    async createEvaluation(score: MatchupEvaluationUserScore) {
        if (this.opposition === null) {
            throw new Error()
        }
        this.$emit('evaluate', score)
        return MatchupEvaluatorService.instance.evaluateMatchup(
            this.opposition.left,
            this.opposition.right,
            score
        )
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.matchup-evaluator {
    background-color: transparent;
    box-shadow: 0 0 0 transparent;
    transition: box-shadow .13s, background-color .13s;
    max-width: 100vw;

    &.sending {
        box-shadow: 0 0 1em hsla(0, 100%, 100%, .3);
        background-color: hsla(0, 100%, 100%, .3);
        transition: box-shadow .13s, background-color .13s;
    }

    .opposition {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        gap: .5em;
        padding: 0 .3em;

        .hero-portrait {
            max-height: 5em;
            width: auto;
            transition: transform .15s, opacity 0.15s;
            border-radius: 2em;
        }

        .state {
            overflow: visible;
            flex-basis: max(17em, 100%);
            max-width: max(17em, 100%);
            position: relative;

            .subject-name, .object-name {
                font-family: 'BigNoodleTooOblique', 'sans-serif';
                font-size: 1.3em;
                text-shadow: 0 0 2px #333333;
                padding: .2em 0;
            }

            .subject-name {
                text-align: left;
                padding-left: .2em;
                font-size: 1.0em;
            }

            .object-name {
                text-align: right;
                padding-right: .2em;
                font-size: 1.0em;
            }

            $option-height: 2em;

            .selected-option-wrap {
                position: relative;
                flex-shrink: 1;
                display: flex;
                flex-direction: column;
                justify-content: stretch;
                overflow: visible;
                flex-basis: max(17em, 100%);
                max-width: max(17em, 100%);
                height: $option-height;
                width: 100%;

                &.empty {
                    display: none;
                }

                button.option {
                    cursor: pointer;
                    font-size: 1.5em;
                    height: 100%;
                    width: 100%;
                    opacity: 1;
                    text-shadow: 1px 1px 1px #345;

                    &:disabled ::v-deep .background {
                        border: 0 !important;
                        box-shadow: none !important;
                    }

                    & ::v-deep .content {
                        padding: 0 1em;
                    }


                    &.remaining-enter, &.remaining-leave-to {
                        height: 0;
                        opacity: 0;
                    }

                    &.remaining-enter-active, &.remaining-leave-active {
                        transition: height 0.15s, opacity .15s;
                    }
                }


            }

            .no-selection {
                height: $option-height/2;
                font-family: BigNoodleTooOblique, sans-serif;
                vertical-align: middle;
                line-height: $option-height/2;
                font-size: 2em;
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

    @media screen and (max-width: 35em) {
        .opposition {
            .state {
                $smaller-font-size: .7em;

                .selected-option-wrap {
                    font-size: $smaller-font-size;

                    button.option {
                        & ::v-deep .content {
                            padding: 0 .5em;
                        }
                    }
                }

                .no-selection {
                    font-size: $smaller-font-size*2;
                }
            }

            .hero-portrait {
                max-height: 3em;
            }
        }
    }

    .matchup-hard-countered ::v-deep .background {
        background-color: hsl(0, 69%, 44%);
    }

    .matchup-countered ::v-deep .background {
        background-color: hsl(0, 49%, 59%);
    }

    .matchup-ok ::v-deep .background {
        background-color: hsl(36, 32%, 64%);
    }

    .matchup-counters ::v-deep .background {
        background-color: hsl(170, 59%, 42%);
    }

    .matchup-hard-counters ::v-deep .background {
        background-color: hsl(180, 76%, 45%);
    }

    .options {
        display: flex;
        justify-content: stretch;
        max-width: 30em;
        margin: 0 auto;
        padding-top: 1em;
        gap: .4em;

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
        padding-top: 3em;
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
