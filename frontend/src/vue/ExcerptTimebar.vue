<template>
    <div class="wrap">
        <div class="excerpt-area" v-bind:style="{ width: excerptWidthPercent+'%', left: excerptStartPercent + '%' }">
            <div class="excerpt-start">{{ startSeconds }}</div>
            <div class="excerpt-end">{{ endSeconds }}</div>
        </div>
        <div class="pointer" v-bind:style="{ left: pointerPositionPercent+'%' }">
            <div class="pointer-label">{{ currentSeconds }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ExcerptTimebar',
        props: {
            startSeconds: {
                type: Number,
            },
            currentSeconds: {
                type: Number
            },
            endSeconds: {
                type: Number,
            },
            durationSeconds: {
                type: Number,
            }
        },
        methods: {},
        computed: {
            excerptWidthPercent() {
                return (this.endSeconds - this.startSeconds) / this.durationSeconds * 100;
            },
            excerptStartPercent() {
                return this.startSeconds / this.durationSeconds * 100;
            },
            pointerPositionPercent() {
                return this.currentSeconds / this.durationSeconds * 100;
            }
        },
        watch: {},
        mounted() {
        },
        data() {
            return {}
        },
    };
</script>

<style scoped>
    .wrap {
        user-select: none;
        background-color: white;
        position: relative;
        min-width: 400px;
        cursor: pointer;
        height: 2em;
        border-radius: .3em;
        overflow: hidden;
    }

    .excerpt-area {
        background-color: red;
        position: absolute;
        display: inline-block;
        height: 100%;
        font-weight: bold;
    }

    .excerpt-start {
        position: absolute;
        left: 0;
        background-color: pink;
        transform: translateX(-50%);
    }

    .excerpt-end {
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: pink;
        transform: translateX(50%);
    }

    .pointer {
        width: 4px;
        background-color: black;
        height: 100%;
        position: absolute;
        transform: translateX(-50%);
    }

    .pointer-label {
        background-color: white;
        width: auto;
        display: inline-block;
        margin-left: -100%;
        margin-right: -100%;
    }
</style>
