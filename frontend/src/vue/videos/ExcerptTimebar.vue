<template>
    <div
            v-hammer:panstart="(e) => onMouseDown(e)"
            v-hammer:panend="(e) => onMouseUp(e)"
            v-hammer:pan="(e) => onMouseMove(e)"
            v-hammer:tap="(e) => onTap(e)"
            class="excerpt-timebar"
            ref="wrap"
    >
        <div class="background"></div>
        <div class="excerpt-area" v-bind:style="{ width: excerptWidthPercent+'%', left: excerptStartPercent + '%' }">
        </div>
        <div class="slider" v-bind:style="{ left: sliderPositionPercent+'%' }">
        </div>
    </div>
</template>

<script lang="ts">
import formatInterval from "@/ts/utils/format-interval";
import Vue from 'vue'
import {Prop, Ref} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class ExcerptTimebar extends Vue {
    @Ref('wrap')
    readonly wrap: HTMLElement

    @Prop({required: true})
    startSeconds: number

    @Prop({required: true})
    currentSeconds: number

    @Prop({required: true})
    endSeconds: number

    @Prop({required: true})
    durationSeconds: number
    @Prop({default: false})

    enableSliderLabel: boolean

    currentDragPosition: number | null = null
    dragStart: number | null = null
    mousemove
    mouseup
    isMouseDown: boolean = false

    onTap(e) {
        this.onMouseDown(e)
        this.onMouseUp(e)
    }

    onMouseDown(e: InputEvent) {
        this.dragStart = this.dragPosition(e);
        this.isMouseDown = true;
    }

    onMouseUp(e: InputEvent) {
        this.isMouseDown = false;
        this.currentDragPosition = null;
        if (this.dragStart === this.dragPosition(e)) {
            this.$emit('draglessClick', this.dragStart);
        } else {
            this.onDragEnd(e)
        }
    }

    onMouseMove(e: InputEvent) {
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
    }

    onDragStart(e) {
        for (let element of document.getElementsByTagName('iframe')) {
            element.style.pointerEvents = 'none';
        }
        this.$emit('dragStart', {
            start: this.dragStart,
            end: this.dragStart,
        });
    }

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
    }

    formatTimeLabel(seconds) {
        return formatInterval(seconds, this.durationSeconds > 3600, true);
    }

    dragPosition(e): number {
        const timebarRect = this.wrap.getBoundingClientRect();
        const x = e.clientX === void 0 ? e.center.x : e.clientX;
        return Math.min(
            Math.max(
                (x - timebarRect.x) / timebarRect.width,
                0
            ),
            1.0
        )
    }

    get excerptWidthPercent(): number {
        return (this.endSecondsVisual - this.startSecondsVisual) / this.durationSeconds * 100;
    }

    get excerptStartPercent(): number {
        return this.startSecondsVisual / this.durationSeconds * 100;
    }

    get sliderPositionPercent(): number {
        return this.currentSeconds / this.durationSeconds * 100;
    }

    get startSecondsVisual(): number {
        if (this.isDragging) {
            return Math.min(this.dragStart, this.currentDragPosition) * this.durationSeconds;
        } else {
            return this.startSeconds;
        }
    }

    get endSecondsVisual(): number {
        if (this.isDragging) {
            return Math.max(this.dragStart, this.currentDragPosition) * this.durationSeconds;
        } else {
            return this.endSeconds;
        }
    }

    get isDragging(): boolean {
        return this.currentDragPosition !== null;
    }

    mounted() {
        const self = this;
        this.mousemove = (e: InputEvent) => {
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
    }

    beforeDestroy() {
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";

.excerpt-timebar {
    user-select: none;
    position: relative;
    cursor: pointer;
    height: 2em;
    border-radius: .3em;
    overflow: hidden;

    .background {
        opacity: .5;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: white;
        box-shadow: 0 0 .2em inset hsl(220, 30%, 30%);
    }
}

.excerpt-area {
    background-color: $tag-enemy-color;
    position: absolute;
    display: inline-block;
    height: 100%;
    font-weight: bold;
    box-shadow: 0 0 .12em $overwatch-panel-bg-color;
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
    width: .18em;
    background-color: $overwatch-button-main-bg-color;
    box-shadow: 0 0 .3em white;
    opacity: .7;
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
