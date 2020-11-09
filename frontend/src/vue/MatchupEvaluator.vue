<template>
    <div
            class="matchup-evaluator"
            v-bind:class="{sending: sending}"
    >
        <div class="opposition">
            <HeroPortrait
                    :hero="subject"
                    v-bind:style="{transform: `scale(${scale(coeff)})`}"
            />
            <div class="state">
                <div class="subject-name">
                    {{subject.name}}
                </div>
                <transition-group
                        tag="div"
                        name="remaining"
                        class="selected-option-wrap"
                        @mouseleave.native="() => {if (selectedScore === null) { coeff = 1.0}}"
                        v-bind:class="selectedScore === null ? 'empty' : ''"
                >
                    <OverwatchPanelButton
                            v-for="option in options"
                            v-if="option.score === selectedScore"
                            :key="option.score"
                            type="default"
                            class="option"
                            v-bind:class="`matchup-${option.classSuffix}`"
                            @mouseover.native="() => {if (selectedScore === null) { coeff = option.coeff}}"
                            disabled="disabled"
                    >{{ option.label }}
                    </OverwatchPanelButton>
                </transition-group>
                <div
                        v-if="selectedScore === null"
                        class="no-selection"
                >VS</div>
                <div class="object-name">
                    {{object.name}}
                </div>
            </div>
            <HeroPortrait
                    :hero="object"
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
                    @mouseover.native="() => {if (selectedScore === null) { coeff = option.coeff}}"
            >
                <font-awesome-icon :icon="option.icon"/>
            </OverwatchPanelButton>
        </div>
    </div>
</template>

<script lang="ts">
import Backend from "@/ts/Backend";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import HeroDto from "data/dto/HeroDto";
import HeroPortrait from "./HeroPortrait.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import OverwatchButton from "@/vue/OverwatchButton.vue";

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
    subject: HeroDto

    @Prop({required: true})
    object: HeroDto

    coeff: number = 1.0

    selectedScore: number | null = null

    sending = false

    options: Option[] = [
        {
            score: 8,
            label: 'hard counters',
            shortLabel: '<<',
            icon: 'angle-double-left',
            classSuffix: 'hard-counters',
            coeff: 1.5,
        },
        {
            score: 4,
            label: 'counters',
            shortLabel: '<',
            icon: 'angle-left',
            classSuffix: 'counters',
            coeff: 1.3,
        },
        {
            score: 0,
            label: 'is ok against',
            shortLabel: '=',
            icon: 'circle',
            classSuffix: 'ok',
            coeff: 1.0,
        },
        {
            score: -4,
            label: 'countered by',
            icon: 'angle-right',
            shortLabel: '>',
            classSuffix: 'countered',
            coeff: 0.7,
        },
        {
            score: -8,
            label: 'hard countered by',
            icon: 'angle-double-right',
            shortLabel: '>>',
            classSuffix: 'hard-countered',
            coeff: 0.5,
        },
    ]

    scale(coeff: number) {
        if (coeff < 1) {
            return coeff + (1 - coeff) * 0.8
        } else {
            return coeff
        }
    }

    onOptionTap(option: Option) {
        if (this.selectedScore !== option.score) {
            this.createEvaluation(option)
        }
    }

    createEvaluation(option: Option) {
        this.sending = true
        setTimeout(() => {
            this.sending = false
        }, 180)
        Backend.instance
            .evaluateMatchup(
                this.subject,
                this.object,
                option.score
            );
        this.selectedScore = option.score
        this.coeff = option.coeff
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
        gap: 1em;
        padding: 0 .5em;

        .hero-portrait {
            max-height: 5em;
            width: auto;
            transition: transform .15s, opacity 0.15s;
            border-radius: 2em;
        }

        .state {
            overflow: visible;
            flex-basis: 17em;
            max-width: 17em;
            position: relative;

            .subject-name, .object-name {
                font-family: 'BigNoodleTooOblique', 'sans-serif';
                font-size: 1.3em;
                text-shadow: 0 0 2px #333333;
                padding: .2em 0;
            }

            .subject-name {
                text-align: left;
            }

            .object-name {
                text-align: right;
            }

            $option-height: 3.6rem;

            .selected-option-wrap {
                flex-shrink: 1;
                display: flex;
                flex-direction: column;
                justify-content: stretch;
                overflow: visible;
                flex-basis: 17em;
                max-width: 17em;
                height: $option-height;

                &.empty {
                    display: none;
                }

                .option {
                    cursor: pointer;
                    font-size: 1.5em;
                    height: $option-height;
                    opacity: 1;
                    text-shadow: 1px 1px 1px #345;

                    button {
                        width: 100%;
                    }

                    &:disabled ::v-deep .background {
                        border: 0 !important;
                        box-shadow: none !important;
                    }

                    & ::v-deep .content {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        padding: 0 1em;
                    }

                    &.remaining-enter, &.remaining-leave-to {
                        height: 0;
                        opacity: 0;
                    }

                    &.remaining-enter-active, &.remaining-leave-active {
                        transition: height .15s, opacity .15s;
                    }

                    &.remaining-enter-to {
                        height: $option-height;
                    }
                }

            }

            .no-selection {
                height: $option-height;
                font-family: BigNoodleTooOblique, sans-serif;
                font-size: 1.4em;
                vertical-align: middle;
                line-height: $option-height;

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
        justify-content: space-evenly;
        max-width: 30em;
        margin: 0 auto;

        padding-top: 1em;

        button ::v-deep .content {
            padding: .2em .4em;
        }
    }

}
</style>
