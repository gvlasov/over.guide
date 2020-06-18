<template>
    <div style="display: inline-block;">
        <span v-if="showHours">
            <div class="time-part-wrap">
                <button class="add-button" @click="hours += 1"></button>
                <input
                        type="text"
                        v-model.number="hours"
                        size="2"
                />
                <button class="subtract-button" @click="hours -= 1"></button>
            </div>
            :
        </span>
        <div class="time-part-wrap">
            <button class="add-button" @click="minutes += 1"></button>
            <input
                    type="text"
                    v-model.number="minutes"
                    size="2"
            />
            <button class="subtract-button" @click="minutes -= 1"></button>
        </div>
        :
        <div class="time-part-wrap">
            <button class="add-button" @click="seconds += 1"></button>
            <input
                    type="text"
                    v-model.number="seconds"
                    size="2"
            />
            <button class="subtract-button" @click="seconds -= 1"></button>
        </div>
        .
        <div class="time-part-wrap">
            <button class="add-button" @click="millis += 10"></button>
            <input
                    type="text"
                    v-model.number="millis"
                    size="3"
            />
            <button class="subtract-button" @click="millis -= 10" v-bind:disabled="millis === 0"></button>
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
            totalValueSeconds: Number,
            showHours: Boolean,
        },
        methods: {},
        computed: {
            hours: {
                get() {
                    return Number.parseInt(
                        Math.floor((this.totalValueSeconds / 3600)).toFixed(0)
                    );
                },
                set(value) {
                    if (value === '') {
                        return;
                    }
                    this.$emit(
                        'totalValueSecondsChange',
                        value * 3600 + this.minutes * 60 + this.seconds + this.millis / 1000
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
                    if (value === '') {
                        return;
                    }
                    this.$emit(
                        'totalValueSecondsChange',
                        this.hours * 3600 + value * 60 + this.seconds + this.millis / 1000
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
                    if (value === '') {
                        return;
                    }
                    this.$emit(
                        'totalValueSecondsChange',
                        this.hours * 3600 + this.minutes * 60 + value + this.millis / 1000
                    );
                }
            },
            millis: {
                get() {
                    return Math.round(((this.totalValueSeconds % 1) * 1000));
                },
                set(value) {
                    if (value === '') {
                        return;
                    }
                    const newValue = this.hours * 3600 + this.minutes * 60 + this.seconds + value / 1000;
                    this.$emit(
                        'totalValueSecondsChange',
                        newValue
                    );
                    console.log(newValue);
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
    }

</style>
