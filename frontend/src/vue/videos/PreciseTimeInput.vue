<template>
    <div class="precise-time-input">
        <template v-if="showHours">
            <div class="time-part-wrap">
                <OverwatchPanelButton
                        type="default"
                        class="subtract-button"
                        v-hammer:tap="() => {hours -= 1}"
                        v-bind:disabled="totalValueSeconds === minSeconds"
                >
                    <img src="/icons/arrow-left-white.svg"/>
                </OverwatchPanelButton>
                <div class="input-wrap">
                    <input
                            type="text"
                            v-model.number="hours"
                            size="2"
                            tabindex="1"
                    />
                    <div class="time-part-interjector">h</div>
                </div>
                <OverwatchPanelButton
                        type="default"
                        class="add-button"
                        v-hammer:tap="() => { seconds = 0; minutes = 0; millis =0; hours += 1;}"
                        v-bind:disabled="totalValueSeconds === maxSeconds"
                >
                    <img src="/icons/arrow-right-white.svg"/>
                </OverwatchPanelButton>
            </div>
        </template>
        <div class="time-part-wrap">
            <OverwatchPanelButton
                    type="default"
                    class="subtract-button"
                    v-hammer:tap="() => {minutes -= 1}"
                    v-bind:disabled="totalValueSeconds === minSeconds"
            >
                <img src="/icons/arrow-left-white.svg"/>
            </OverwatchPanelButton>
            <div class="input-wrap">
                <input
                        type="text"
                        v-model.number="minutes"
                        size="2"
                        tabindex="1"
                />
                <div class="time-part-interjector">m</div>
            </div>
            <OverwatchPanelButton
                    type="default"
                    class="add-button"
                    v-hammer:tap="() => {minutes += 1}"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            >
                <img src="/icons/arrow-right-white.svg"/>
            </OverwatchPanelButton>
        </div>
        <div class="time-part-wrap">
            <OverwatchPanelButton
                    type="default"
                    class="subtract-button"
                    v-hammer:tap="() => {seconds -= 1}"
                    v-bind:disabled="totalValueSeconds === minSeconds"
            >
                <img src="/icons/arrow-left-white.svg"/>
            </OverwatchPanelButton>
            <div class="input-wrap">
                <input
                        type="text"
                        v-model.number="seconds"
                        size="2"
                        tabindex="1"
                />
                <div class="time-part-interjector">s</div>
            </div>
            <OverwatchPanelButton
                    type="default"
                    class="add-button"
                    v-hammer:tap="() => {seconds += 1}"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            >
                <img src="/icons/arrow-right-white.svg"/>
            </OverwatchPanelButton>
        </div>
        <div class="time-part-wrap">
            <OverwatchPanelButton
                    type="default"
                    class="subtract-button"
                    v-hammer:tap="() => {millis -= 25}"
                    v-bind:disabled="totalValueSeconds === minSeconds"
            >
                <img src="/icons/arrow-left-white.svg"/>
            </OverwatchPanelButton>
            <div class="input-wrap">
                <input
                        type="text"
                        v-model.number="millis"
                        size="3"
                        tabindex="1"
                />
                <div class="time-part-interjector">ms</div>
            </div>
            <OverwatchPanelButton
                    type="default"
                    class="add-button"
                    v-hammer:tap="() => {millis += 25}"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            >
                <img src="/icons/arrow-right-white.svg"/>
            </OverwatchPanelButton>
        </div>
    </div>
</template>

<script lang="ts">

import OverwatchButton from "@/vue/OverwatchButton";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import Vue from 'vue'
import {Model, Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        OverwatchButton,
        OverwatchPanelButton,
    }
})
export default class PreciseTimeInput extends Vue {
    @Model('totalValueSecondsChange', {required: true})
    totalValueSeconds: number

    @Prop({required: true})
    maxSeconds: number
    @Prop({required: true})
    minSeconds: number
    @Prop({required: true})
    showHours: boolean

    setNewTotalSecondsWithClamping(targetTime: number) {
        if (targetTime > this.maxSeconds) {
            this.setNewTotalSeconds(
                this.maxSeconds
            );
        } else {
            this.setNewTotalSeconds(targetTime);
        }
    }

    setNewTotalSeconds(value) {
        if (value === '') {
            return;
        }
        let newTotalSeconds = value
        if (newTotalSeconds > this.maxSeconds) {
            newTotalSeconds = this.maxSeconds;
        } else if (newTotalSeconds < this.minSeconds) {
            newTotalSeconds = this.minSeconds;
        }
        this.$emit('totalValueSecondsChange', newTotalSeconds);
    }

    get hours() {
        return Number.parseInt(
            Math.floor((this.totalValueSeconds / 3600)).toFixed(0)
        );
    }

    set hours(value: number) {
        this.setNewTotalSecondsWithClamping(
            value * 3600 + this.minutes * 60 + this.seconds + this.millis / 1000
        );
    }

    get minutes() {
        return Number.parseInt(
            Math.floor(((this.totalValueSeconds / 60) % 60)).toFixed(0)
        );
    }

    set minutes(value) {
        this.setNewTotalSecondsWithClamping(
            this.hours * 3600 + value * 60 + this.seconds + this.millis / 1000
        );
    }

    get seconds() {
        return Number.parseInt(
            Math.floor((this.totalValueSeconds % 60)).toFixed(0)
        );
    }

    set seconds(value) {
        this.setNewTotalSecondsWithClamping(
            this.hours * 3600 + this.minutes * 60 + value + this.millis / 1000
        );
    }

    get millis() {
        return Math.round(((this.totalValueSeconds % 1) * 1000));
    }

    set millis(value) {
        this.setNewTotalSecondsWithClamping(
            this.hours * 3600 + this.minutes * 60 + this.seconds + value / 1000
        );
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.precise-time-input {
    display: inline-flex;
    gap: .3em;

    .time-part-wrap {
        display: flex;

        .input-wrap {
            position: relative;

            & > input[type=text] {
                font-family: "Futura Demi Bold", sans-serif !important;
                font-size: 1.2em !important;
                background-color: hsla(0, 0, 100%, .65);
                border: 0;
                color: #333;
            }

            .time-part-interjector {
                display: block;
                position: absolute;
                color: #333;
                pointer-events: none;
                bottom: -.15em;
                font-family: "Futura Demi Bold", sans-serif;
                right: .1em;
                font-size: 1.2em;
            }

            input[type='text'] {
                text-align: center;
                font-family: monospace;
                font-size: 1.5em;
                position: relative;
                height: 100%;
                box-sizing: border-box;
            }

        }

        .add-button, .subtract-button {
            outline: 0;
            display: block;
            width: .5em;
            height: 100%;
            background-size: .5em;
            background-repeat: no-repeat;
            background-position: center;
            overflow: hidden;

            img {
                width: .3em;
            }

            & ::v-deep .content {
                padding: 0;
                min-width: 0;
                display: flex;
                justify-content: center;
                align-content: center;
                flex-direction: row;
                margin: 0 auto;
                width: 100%;
            }

            & ::v-deep .background {
                border-radius: 0;
            }
        }

        .add-button[disabled], .subtract-button[disabled] {
            & ::v-deep .background {
                background: transparent;
            }
        }

        $adjust-button-border-radius: .15em;

        .add-button {
            border-radius: 0 $adjust-button-border-radius $adjust-button-border-radius 0 !important;
        }

        .subtract-button {
            border-radius: $adjust-button-border-radius 0 0 $adjust-button-border-radius !important;
        }
    }


}

</style>
