<template>
    <div
            @mousedown="onDragStart"
            @mouseup="onDragEnd"
            @mousemove="onMouseMove"
            class="wrap"
            ref="wrap"
    >
        <div class="excerpt-area" v-bind:style="{ width: excerptWidthPercent+'%', left: excerptStartPercent + '%' }">
            <div class="excerpt-start">{{ formatTimeLabel(startSecondsVisual) }}</div>
            <div class="excerpt-end">{{ formatTimeLabel(endSecondsVisual) }}</div>
        </div>
        <div class="slider" v-bind:style="{ left: sliderPositionPercent+'%' }">
            <div
                    v-if="enableSliderLabel"
                    class="slider-label"
            >{{ formatTimeLabel(currentSeconds) }}
            </div>
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
            },
            enableSliderLabel: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            formatTimeLabel(seconds) {
                return seconds.toFixed(2);
            },
            onDragStart(e) {
                this.dragStart = this.dragPosition(e);
                this.currentDragPosition = this.dragStart;
                for (let element of document.getElementsByTagName('iframe')) {
                    element.style.pointerEvents = 'none';
                }
                this.$emit('dragStart', {
                    start: this.dragStart,
                    end: this.dragStart,
                });
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
            onDragEnd(e) {
                this.$emit(
                    'dragEnd',
                    {
                        start: this.dragStart,
                        end: this.dragPosition(e)
                    }
                );
                this.currentDragPosition = null;
                for (let element of document.getElementsByTagName('iframe')) {
                    element.style.pointerEvents = 'auto';
                }
            },
            onMouseMove(e) {
                if (!this.isDragging) {
                    return;
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
