<template>
    <div style="display: inline-block;">
        <span v-if="showHours">
            <input
                    type="text"
                    v-model.number="hours"
                    size="2"
            />
            :
        </span>
        <input
                type="text"
                v-model.number="minutes"
                size="2"
        />:
        <input
                type="text"
                v-model.number="seconds"
                size="2"
        />
        .
        <input
                type="text"
                v-model.number="millis"
                size="3"
        />
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
                    this.$emit(
                        'totalValueSecondsChange',
                        value * 3600 + this.minutes * 60 + this.seconds + Math.round(this.millis / 1000)
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
                    this.$emit(
                        'totalValueSecondsChange',
                        this.hours * 3600 + value * 60 + this.seconds + Math.round(this.millis / 1000)
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
                    this.$emit(
                        'totalValueSecondsChange',
                        this.hours * 3600 + this.minutes * 60 + value + Math.round(this.millis / 1000)
                    );
                }
            },
            millis: {
                get() {
                    return Math.round(((this.totalValueSeconds % 1) * 1000));
                },
                set(value) {
                    this.$emit(
                        'totalValueSecondsChange',
                        this.hours * 3600 + this.minutes * 60 + this.seconds + Math.round(value / 1000)
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
</style>
