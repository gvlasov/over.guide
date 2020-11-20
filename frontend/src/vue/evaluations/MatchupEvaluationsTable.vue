<template>
    <div class="matchup-evaluations">
        <table>
            <thead>
            <tr>
                <td class="corner">VS</td>
                <td
                        v-for="hero in heroes"
                        class="col-header"
                >
                    <HeroPortrait
                            :hero="hero"
                            base-url="/images/roster-portraits"
                    />
                </td>
            </tr>
            </thead>
            <tr
                    v-for="(rowHero, rowIndex) in heroes"
            >
                <td
                        class="row-header"
                >
                    <HeroPortrait
                            :hero="rowHero"
                            base-url="/images/roster-portraits"
                    />
                </td>
                <td
                        v-for="(colHero, colIndex) in heroes"
                        @mouseenter="() => onOppositionHover(rowIndex, colIndex)"
                        @mouseleave="() => {selectedRow = null; selectedCol = null}"
                        v-bind:class="{['matchup-'+scoreClassSuffix(rowHero, colHero)]: true}"
                >
                    <HeroPortrait
                            v-if="colIndex === rowIndex"
                            :hero="colHero"
                            base-url="/images/roster-portraits"
                            class="neutral-hero"
                    />
                    <div
                            v-if="rowIndex !== colIndex && rowIndex === selectedRow && colIndex === selectedCol"
                            class="selected-opposition"
                    >
                        <HeroPortrait
                                :hero="rowHero"
                                base-url="/images/roster-portraits"
                                class="row-portrait"
                        />
                        <HeroPortrait
                                :hero="colHero"
                                base-url="/images/roster-portraits"
                                class="col-portrait"
                        />
                    </div>
                    <OverwatchPanelButton
                            v-if="rowIndex !== colIndex && rowIndex === selectedRow && colIndex === selectedCol"
                            type="default"
                            class="evaluate-button"
                            v-hammer:tap="() => $emit('selectOpposition', {left: rowHero, right: colHero})"
                    >
                        <font-awesome-icon icon="people-arrows"/>
                    </OverwatchPanelButton>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import HeroPortrait from "@/vue/HeroPortrait.vue";
import heroes from 'data/heroes'
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";
import HeroDto from "data/dto/HeroDto";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";

@Component({
    components: {
        OverwatchPanelButton,
        HeroPortrait,
    }
})
export default class MatchupEvaluationsTable extends Vue {

    service = MatchupEvaluatorService.instance

    heroes = Array.from(heroes.values())

    selectedRow = -1

    selectedCol = -1

    onOppositionHover(rowIndex: number, colIndex: number) {
        this.selectedRow = rowIndex
        this.selectedCol = colIndex
    }

    shouldHighlight(rowIndex: number, colIndex: number) {
        return this.selectedRow === rowIndex ||
            this.selectedCol === colIndex
    }

    scoreClassSuffix(subject: HeroDto, object: HeroDto): string | null {
        const score = this.service.getScore({left: subject, right: object});
        if (subject.id === object.id) {
            return 'unavailable'
        } else if (score === MatchupEvaluationUserScore.DontKnow) {
            return MatchupEvaluatorService.instance.dontKnowOption.classSuffix
        } else if (score !== null) {
            const option = MatchupEvaluatorService.instance.options.find(o => o.score === score);
            return option.classSuffix
        } else {
            return null
        }
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import '~@/assets/css/common.scss';


.matchup-evaluations {
    $bgcolor: hsla(227, 16%, 48%, 0.94);
    background-color: $bgcolor;
    @include custom-desktop-scrollbar($bgcolor);
    overflow: auto;
    max-height: 100vh;
    width: 100%;

    table {
        border-spacing: 0;
        border-collapse: collapse;
        position: relative;

        td.corner {
            font-weight: bold;
        }

        td {
            position: relative;
            border: 1px solid hsl(180, 2%, 20%, .2);
            cursor: pointer;
            padding: 0;
            height: 36px;
            width: 36px;
            line-height: 0;

            & > img {
                height: 100%;
                width: auto;
            }

            &.row-header {
                position: sticky;
                left: -1px;
                z-index: 2;
                background-color: $bgcolor;
                border-left: 1px solid rgba($overwatch-panel-bg-color, 0.94);
            }

            &.col-header {
                position: sticky;
                top: -1px;
                z-index: 2;
                background-color: $bgcolor;
                border-top: 1px solid rgba($overwatch-panel-bg-color, 0.94);
            }

            .selected-opposition {
                pointer-events: none;
                background-color: hsla(209, 18%, 45%, .1);
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 1;

                .hero-portrait {
                    height: 36px;
                    width: auto;
                    position: absolute;
                }

                .row-portrait {
                    transform: translateX(-100%);
                    left: 0
                }

                .col-portrait {
                    right: 0;
                    transform: translateX(100%);
                }
            }

            .evaluate-button {
                font-size: 1.5em;
                width: 100%;
                height: 100%;
            }

            .neutral-hero {
                position: absolute;
                top: 0;
                left: 0;
                opacity: .3;
                cursor: default;
            }
        }

        //tr:hover {
        //    background-color: hsla(209, 18%, 45%, .5);
        //}

        td {

            //&:hover::after {
            //    // https://css-tricks.com/simple-css-row-column-highlighting/
            //    content: "";
            //    position: absolute;
            //    background-color: hsla(209, 18%, 45%, .5);
            //    left: 0;
            //    top: -5000px;
            //    height: 10000px;
            //    width: 100%;
            //    z-index: 0;
            //    pointer-events: none;
            //}

            &.matchup-hard-countered {
                background-color: hsla(0, 69%, 44%, .9);
            }

            &.matchup-countered {
                background-color: hsla(0, 49%, 59%, .9);
            }

            &.matchup-ok {
                background-color: hsla(36, 32%, 64%, .9);
            }

            &.matchup-counters {
                background-color: hsla(170, 25%, 49%, .9);
            }

            &.matchup-hard-counters {
                background-color: hsla(180, 76%, 45%, .9);
            }

            &.matchup-unavailable {
                background-color: hsla(180, 10%, 90%, .9);
            }
        }

    }
}

</style>
