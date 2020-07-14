<template>
    <div class="wrap">
        <span v-if="showHours">
            <div class="time-part-wrap">
                <button
                        class="add-button"
                        @click="seconds = 0; minutes = 0; millis =0; hours += 1;"
                        v-bind:disabled="totalValueSeconds === maxSeconds"
                ></button>
                <input
                        type="text"
                        v-model.number="hours"
                        size="2"
                        tabindex="1"
                />
                <button
                        class="subtract-button"
                        @click="hours -= 1"
                        v-bind:disabled="totalValueSeconds === 0"
                ></button>
            </div>
            :
        </span>
        <div class="time-part-wrap">
            <button
                    class="add-button"
                    @click="minutes += 1"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            ></button>
            <input
                    type="text"
                    v-model.number="minutes"
                    size="2"
                    tabindex="1"
            />
            <button
                    class="subtract-button"
                    @click="minutes -= 1"
                    v-bind:disabled="totalValueSeconds === 0"
            ></button>
        </div>
        :
        <div class="time-part-wrap">
            <button
                    class="add-button"
                    @click="seconds += 1"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            ></button>
            <input
                    type="text"
                    v-model.number="seconds"
                    size="2"
                    tabindex="1"
            />
            <button
                    class="subtract-button"
                    @click="seconds -= 1"
                    v-bind:disabled="totalValueSeconds === 0"
            ></button>
        </div>
        .
        <div class="time-part-wrap">
            <button
                    class="add-button"
                    @click="millis += 25"
                    v-bind:disabled="totalValueSeconds === maxSeconds"
            ></button>
            <input
                    type="text"
                    v-model.number="millis"
                    size="3"
                    tabindex="1"
            />
            <button
                    class="subtract-button"
                    @click="millis -= 25"
                    v-bind:disabled="totalValueSeconds === 0"
            ></button>
        </div>
    </div>
</template>

<script>

    export default {
        model: {
            prop: 'totalValueSeconds',
            event: 'totalValueSecondsChange',
        },
        props: {
            totalValueSeconds: {
                type: Number,
                required: true,
            },
            maxSeconds: {
                type: Number,
                required: true,
            },
            showHours: Boolean,
        },
        methods: {
            setNewTotalSecondsWithClamping(targetTime, alternativeTime) {
                if (targetTime > this.maxSeconds) {
                    this.setNewTotalSeconds(
                        alternativeTime
                    );
                } else {
                    this.setNewTotalSeconds(targetTime);
                }
            },
            setNewTotalSeconds(value) {
                if (value === '') {
                    return;
                }
                let newTotalSeconds = value
                if (newTotalSeconds > this.maxSeconds) {
                    newTotalSeconds = this.maxSeconds;
                } else if (newTotalSeconds < 0) {
                    newTotalSeconds = 0;
                }
                this.$emit('totalValueSecondsChange', newTotalSeconds);
            },
        },
        computed: {
            hours: {
                get() {
                    return Number.parseInt(
                        Math.floor((this.totalValueSeconds / 3600)).toFixed(0)
                    );
                },
                set(value) {
                    this.setNewTotalSecondsWithClamping(
                        value * 3600 + this.minutes * 60 + this.seconds + this.millis / 1000,
                        value * 3600
                    );
                }
            },
            minutes: {
                get() {
                    return Number.parseInt(
                        Math.floor(((this.totalValueSeconds / 60) % 60)).toFixed(0)
                    );
                },
                set(value) {
                    this.setNewTotalSecondsWithClamping(
                        this.hours * 3600 + value * 60 + this.seconds + this.millis / 1000,
                        this.hours * 3600 + value * 60
                    );
                }
            },
            seconds: {
                get() {
                    return Number.parseInt(
                        Math.floor((this.totalValueSeconds % 60)).toFixed(0)
                    );
                },
                set(value) {
                    this.setNewTotalSecondsWithClamping(
                        this.hours * 3600 + this.minutes * 60 + value + this.millis / 1000,
                        this.hours * 3600 + this.minutes * 60 + value
                    );
                }
            },
            millis: {
                get() {
                    return Math.round(((this.totalValueSeconds % 1) * 1000));
                },
                set(value) {
                    this.setNewTotalSeconds(
                        this.hours * 3600 + this.minutes * 60 + this.seconds + value / 1000
                    );
                }
            },
        },
        data() {
            return {}
        },
        components: {},
    };

</script>

<style scoped>
    .time-part-wrap {
        display: inline-block;
    }

    .add-button, .subtract-button {
        display: block;
        width: 100%;
        height: 1em;
        border: 1px solid grey;
        background-color: lightgrey;
        background-size: .5em;
        background-repeat: no-repeat;
        background-position: center;
    }

    .add-button[disabled], .subtract-button[disabled] {
        visibility: hidden;
    }

    .add-button {
        border-radius: .3em .3em 0 0;
        background-image: url("/icons/arrow-up.svg");
    }

    .subtract-button {
        border-radius: 0 0 .3em .3em;
        background-image: url("/icons/arrow-down.svg");
    }

    input[type='text'] {
        text-align: center;
        font-family: monospace;
        font-size: 1.5em;
    }

    .wrap {
        display: inline-block;
    }
</style>
