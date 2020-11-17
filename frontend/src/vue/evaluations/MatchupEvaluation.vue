<template>
    <div class="matchup-evaluation">
        <HeroPortrait
                :hero="evaluation.opposition.left"
                v-bind:style="{transform: visibleScore !== null ? `scale(${coeffsLeft[visibleScore]})` : ''}"
        />
        <div class="state">
            <div class="subject-name">
                {{ evaluation.opposition.left.name }}
            </div>
            <transition-group
                    tag="div"
                    name="remaining"
                    class="selected-option-wrap"
                    v-bind:class="evaluation.isEvaluated ? '' : 'empty'"
            >
                <MatchupEvaluationButton
                        v-for="option in MatchupEvaluatorService.instance.options"
                        v-if="option.score === evaluation.score"
                        :key="option.score"
                        class="option"
                        :class-suffix="option.classSuffix"
                        disabled="disabled"
                >{{ option.label }}
                </MatchupEvaluationButton>
            </transition-group>
            <div
                    v-if="!evaluation.isEvaluated"
                    class="no-selection"
            >VS
            </div>
            <div class="object-name">
                {{ evaluation.opposition.right.name }}
            </div>
        </div>
        <HeroPortrait
                :hero="evaluation.opposition.right"
                v-bind:style="{transform: visibleScore !== null ? `scale(${coeffsRight[visibleScore]})` : ''}"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import HeroPortrait from "@/vue/HeroPortrait.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";
import MatchupEvaluationButton
    from "@/vue/evaluations/MatchupEvaluationButton.vue";

@Component({
    components: {
        MatchupEvaluationButton,
        OverwatchButton,
        OverwatchPanelButton,
        HeroPortrait,
    }
})
export default class MatchupEvaluation extends Vue {
    MatchupEvaluatorService = MatchupEvaluatorService

    @Prop({required: true})
    evaluation: MatchupEvaluationVso

    @Prop({required: true})
    hoveredScore: number | null

    get visibleScore(): MatchupEvaluationUserScore|null {
        return this.hoveredScore ?? this.evaluation.score
    }

    coeffsLeft: {
        [key: number]: number
    } = {
        [MatchupEvaluationUserScore.HardCounters]: 1.4,
        [MatchupEvaluationUserScore.Counters]: 1.2,
        [MatchupEvaluationUserScore.Ok]: 1.0,
        [MatchupEvaluationUserScore.Countered]: .9,
        [MatchupEvaluationUserScore.HardCountered]: .8,
        [MatchupEvaluationUserScore.DontKnow]: 1.0,
    }

    coeffsRight: {
        [key: number]: number
    } = {
        [MatchupEvaluationUserScore.HardCounters]: .8,
        [MatchupEvaluationUserScore.Counters]: .9,
        [MatchupEvaluationUserScore.Ok]: 1.0,
        [MatchupEvaluationUserScore.Countered]: 1.2,
        [MatchupEvaluationUserScore.HardCountered]: 1.4,
        [MatchupEvaluationUserScore.DontKnow]: 1.0,
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.matchup-evaluation {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    gap: .5em;
    box-sizing: border-box;

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

@media screen and (max-width: 35em) {
    .matchup-evaluation {
        padding: 0 .3em;
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
</style>
