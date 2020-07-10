<template>
    <div
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @mousemove="onMouseMove"
            class="wrap"
            ref="wrap"
    >
        <div class="excerpt-area" v-bind:style="{ width: excerptWidthPercent+'%', left: excerptStartPercent + '%' }">
            <!--            <div class="excerpt-start">{{ formatTimeLabel(startSecondsVisual) }}</div>-->
            <!--            <div class="excerpt-end">{{ formatTimeLabel(endSecondsVisual) }}</div>-->
        </div>
        <div class="slider" v-bind:style="{ left: sliderPositionPercent+'%' }">
            <!--            <div-->
            <!--                    v-if="enableSliderLabel"-->
            <!--                    class="slider-label"-->
            <!--            >{{ formatTimeLabel(currentSeconds) }}-->
        </div>
        </div>
    </div>
</template>

<script>
    import formatInterval from "../js/utils/format-interval";

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
            },
            enableSliderLabel: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onMouseDown(e) {
                this.dragStart = this.dragPosition(e);
                this.isMouseDown = true;
            },
            onMouseUp(e) {
                this.isMouseDown = false;
                this.currentDragPosition = null;
                if (this.dragStart === this.dragPosition(e)) {
                    this.$emit('draglessClick', this.dragStart);
                } else {
                    this.onDragEnd(e)
                }
            },
            onMouseMove(e) {
                if (!this.isMouseDown) {
                    return;
                }
                if (this.currentDragPosition === null) {
                    this.onDragStart(e);
                }
                this.currentDragPosition = this.dragPosition(e);
                this.$emit(
                    'dragContinue',
                    {
                        start: this.dragStart,
                        end: this.currentDragPosition
                    }
                );
            },
            onDragStart(e) {
                for (let element of document.getElementsByTagName('iframe')) {
                    element.style.pointerEvents = 'none';
                }
                this.$emit('dragStart', {
                    start: this.dragStart,
                    end: this.dragStart,
                });
            },
            onDragEnd(e) {
                this.$emit(
                    'dragEnd',
                    {
                        start: this.dragStart,
                        end: this.dragPosition(e)
                    }
                );
                for (let element of document.getElementsByTagName('iframe')) {
                    element.style.pointerEvents = 'auto';
                }
            },
            dragPosition(e) {
                const timebarRect = this.$refs.wrap.getBoundingClientRect();
                return Math.min(
                    Math.max(
                        (e.clientX - timebarRect.x) / timebarRect.width,
                        0
                    ),
                    1.0
                )
            },
            formatTimeLabel(seconds) {
                return formatInterval(seconds, this.durationSeconds > 3600, true);
            },
        },
        computed: {
            excerptWidthPercent() {
                return (this.endSecondsVisual - this.startSecondsVisual) / this.durationSeconds * 100;
            },
            excerptStartPercent() {
                return this.startSecondsVisual / this.durationSeconds * 100;
            },
            sliderPositionPercent() {
                return this.currentSeconds / this.durationSeconds * 100;
            },
            /**
             * @returns {number}
             */
            startSecondsVisual() {
                if (this.isDragging) {
                    return Math.min(this.dragStart, this.currentDragPosition) * this.durationSeconds;
                } else {
                    return this.startSeconds;
                }
            },
            /**
             * @returns {number}
             */
            endSecondsVisual() {
                if (this.isDragging) {
                    return Math.max(this.dragStart, this.currentDragPosition) * this.durationSeconds;
                } else {
                    return this.endSeconds;
                }
            },
            /**
             * @returns {boolean}
             */
            isDragging() {
                return this.currentDragPosition !== null;
            }
        },
        watch: {},
        mounted() {
            const self = this;
            this.mousemove = (e) => {
                self.onMouseMove(e);
            };
            this.mouseup = (e) => {
                if (!self.isDragging) {
                    return
                }
                self.onDragEnd(e);
            };
            window.addEventListener('mousemove', this.mousemove);
            window.addEventListener('mouseup', this.mouseup);
        },
        beforeDestroy() {
            window.removeEventListener('mousemove', this.mousemove);
            window.removeEventListener('mouseup', this.mouseup);
        },
        data() {
            return {
                currentDragPosition: null,
                dragStart: null,
                mousemove: null,
                mouseup: null,
                isMouseDown: false,
            }
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

    .slider {
        width: 2px;
        background-color: black;
        height: 100%;
        position: absolute;
        transform: translateX(-50%);
    }

    .slider-label {
        background-color: white;
        width: auto;
        display: inline-block;
        text-align: center;
        transform: translateX(-50%);
    }
</style>
