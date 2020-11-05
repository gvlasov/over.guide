<template>
    <div
            class="matchup-evaluator"
            v-bind:class="{sending: sending}"
    >
        <HeroPortrait
                :hero="subject"
                v-bind:style="{transform: `scale(${scale(coeff)})`, opacity: coeff}"
        />
        <transition-group
                tag="div"
                name="remaining"
                class="options"
                @mouseleave.native="() => {if (selectedScore === null) { coeff = 1.0}}"
        >
            <OverwatchPanelButton
                    v-for="option in options"
                    v-if="selectedScore === null || option.score === selectedScore"
                    :key="option.score"
                    type="default"
                    class="option"
                    v-bind:class="`matchup-${option.classSuffix}`"
                    v-hammer:tap="() => onOptionTap(option)"
                    @mouseover.native="() => {if (selectedScore === null) { coeff = option.coeff}}"
            >{{ option.label }}
            </OverwatchPanelButton>
            <div
                    v-if="selectedScore !== null"
                    key="repick"
                    class="repick-wrap"
            >
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => selectedScore = null"
                >Repick
                </OverwatchButton>
            </div>
        </transition-group>
        <HeroPortrait
                :hero="object"
                v-bind:style="{transform: `scale(${scale(2-coeff)})`, opacity: 2-coeff}"
        />
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
            classSuffix: 'hard-counters',
            coeff: 1.5,
        },
        {
            score: 4,
            label: 'counters',
            classSuffix: 'counters',
            coeff: 1.3,
        },
        {
            score: 0,
            label: 'ok against',
            classSuffix: 'ok',
            coeff: 1.0,
        },
        {
            score: -4,
            label: 'countered by',
            classSuffix: 'countered',
            coeff: 0.7,
        },
        {
            score: -8,
            label: 'hard countered by',
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
        if (this.selectedScore === null) {
            this.createEvaluation(option)
        } else {
            this.selectedScore = null
        }
    }

    createEvaluation(option: Option) {
        this.sending = true
        setTimeout(() => {
            this.sending = false
        }, 150)
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
.matchup-evaluator {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: nowrap;
    background-color: transparent;
    box-shadow: 0 0 0 transparent;
    transition: box-shadow .13s, background-color .13s;
    max-width: 100vw;

    &.sending {
        box-shadow: 0 0 1em hsla(0, 100%, 100%, .3);
        background-color: hsla(0, 100%, 100%, .3);
        transition: box-shadow .13s, background-color .13s;
    }

    & > img {
        max-height: 7em;
        width: auto;
        transition: transform .13s, opacity .13s;
        border-radius: 2em;
    }

    .options {
        position: relative;
        flex-shrink: 1;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: .8em;
        overflow: visible;
        flex-basis: 17em;
        max-width: 17em;

        $option-height: 2em;

        .option {
            overflow: hidden;
            cursor: pointer;
            font-size: 1.5em;
            height: $option-height;
            opacity: 1;
            &:disabled ::v-deep .background {
                border: 0 !important;
                box-shadow: none !important;
            }

            & ::v-deep .content {
                text-overflow: ellipsis;
                overflow: hidden;
                padding: 0 1em;
            }

            text-shadow: 1px 1px 1px #345;

            &.matchup-hard-countered ::v-deep .background {
                background-color: hsl(0, 69%, 44%);
            }

            &.matchup-countered ::v-deep .background {
                background-color: hsl(0, 49%, 59%);
            }

            &.matchup-ok ::v-deep .background {
                background-color: hsl(36, 32%, 64%);
            }

            &.matchup-counters ::v-deep .background {
                background-color: hsl(71, 59%, 46%);
            }

            &.matchup-hard-counters ::v-deep .background {
                background-color: hsl(99, 69%, 44%);
            }

            &.remaining-enter, &.remaining-leave-to {
                height: 0;
                opacity: 0;
            }

            &.remaining-enter-active, &.remaining-leave-active {
                transition: height .13s, opacity .13s;
            }

        }

        .repick-wrap {
            position: absolute;
            height: 0;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 1em);

            button {
                font-size: 1.5em;
            }
        }
    }

}
</style>
