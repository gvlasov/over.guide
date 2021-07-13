<template>
    <div class="wrap">
        <AspectRatioBox>
            <YoutubeVideo
                    :videoId="videoId"
                    :start="startSeconds"
                    :end="endSeconds"
                    :loop="true"
                    :autoplay="true"
                    :custom-player-element-id="playerElementId"
                    @playerReady="onPlayerReady"
                    @play="onPlay"
                    @pause="onPause"
                    @skip="onSkip"
                    class="video"
            />
        </AspectRatioBox>
        <div v-if="preciseDurationAvailable">
            <ExcerptTimebar
                    v-if="isVideoLoaded"
                    :start-seconds="startSeconds"
                    :end-seconds="endSeconds"
                    :current-seconds="currentSeconds"
                    :duration-seconds="durationSeconds"
                    @mouseenter.native="hovered = true"
                    @mouseleave.native="hovered = false"
                    :enable-slider-label="hovered"
                    @dragStart="onDragStart"
                    @dragEnd="onDragEnd"
                    @dragContinue="onDragContinue"
                    @draglessClick="onDraglessClick"
                    class="timebar"
            />
        </div>
        <div v-if="preciseDurationAvailable" class="controls">
            <div class="time-input-group start-group">
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model.number="startSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="endSeconds"
                        :min-seconds="0"
                        class="time-input-start left-shift-1"
                />
                <OverwatchPanelButton
                        class="cut-start action-button left-shift-1"
                        v-hammer:tap="startCut"
                        title="Start loop at current position"
                        type="default"
                >start cut
                </OverwatchPanelButton>
            </div>
            <div class="time-input-group end-group">
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model="endSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="durationSeconds"
                        :min-seconds="startSeconds"
                        class="time-input-end left-shift-0"
                />
                <OverwatchPanelButton
                        class="cut-end action-button"
                        v-hammer:tap="endCut"
                        title="End loop at current position"
                        type="default"
                >end cut
                </OverwatchPanelButton>
            </div>
            <div class="total-cut-group">
                <OverwatchPanelButton
                        class="reset-button action-button left-shift-2"
                        v-hammer:tap="resetLoopWindow"
                        title="Reset loop window to entire video"
                        type="default"
                >reset cut
                </OverwatchPanelButton>
                <div class="total-cut-length">
                    {{ relativePositionText }}<br/>
                    <div>
                        <span class="hanging">/ </span>
                        {{ totalCutLengthText }}
                    </div>
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>
        <OverwatchDropdownButton
                v-if="$asyncComputed.guidesWithSameVideo.success && intersectingGuides.length > 0"
                :open="showSameVideoGuides"
                class="intersections"
                v-bind:class="{'intersections-available': intersectingGuides.length > 0}"
                v-hammer:tap="onSameVideoGuidesDropdownTap"
        >
            {{ intersectingGuides.length }} guide{{intersectingGuides.length % 10 === 1 ? '' : 's'}} intersecting with your cut
        </OverwatchDropdownButton>
        <div
                v-if="showSameVideoGuides && intersectingGuides.length > 0"
                class="same-video-guides"
        >
            <GuidePreviewBadge
                    v-for="(widget, index) in intersectingGuides"
                    :key="widget.head.entry.guideId"
                    :head="widget.head"
                    :order="widget.order"
                    :open="widget.open"
                    :ghost="false"
                    @open="() => {closeAllIntersectingGuides(); widget.open = true;}"
                    @close="() => { widget.open = false}"
            />
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import ExcerptTimebar from "@/vue/videos/ExcerptTimebar.vue";
import PreciseTimeInput from "@/vue/videos/PreciseTimeInput.vue";
import Backend from "@/ts/Backend";
import axios from "axios";
import OverwatchButton from "@/vue/OverwatchButton";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import AspectRatioBox from "@/vue/AspectRatioBox";
import VideoLoadingScreen from "@/vue/VideoLoadingScreen";
import TrainingGoal from "@/vue/guides/TrainingGoal";
import GuidePreviewBadge from "@/vue/guides/GuidePreviewBadge";
import TrainingGoalWidget from "@/ts/vso/TrainingGoalWidget";
import OverwatchDropdownButton from "@/vue/OverwatchDropdownButton";
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import AsyncComputedProp from 'vue-async-computed-decorator'
import Component from "vue-class-component";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import Player = YT.Player;

const backend = new Backend(axios);
const intersectionThresholdSeconds = .3
const allowSeekAhead = false

@Component({
    components: {
        OverwatchDropdownButton,
        GuidePreviewBadge,
        TrainingGoal,
        VideoLoadingScreen,
        AspectRatioBox,
        OverwatchButton,
        OverwatchPanelButton,
        PreciseTimeInput,
        YoutubeVideo,
        ExcerptTimebar,
    }
})
export default class YoutubeExcerptEditor extends Vue {
    @Prop({required: true})
    videoId: string

    @Prop({required: true})
    initialStartSeconds: number

    @Prop({required: true})
    initialEndSeconds: number

    @Prop({default: ''})
    playerElementId: string

    startSeconds: number = this.initialStartSeconds
    endSeconds: number = this.initialEndSeconds
    durationSeconds: number = this.endSeconds - this.startSeconds
    currentSeconds: number = this.startSeconds
    player: Player
    playing: boolean = false
    hovered: boolean = false
    playerHasBeenPlaying: boolean | null = null
    isVideoLoaded: boolean = false
    preciseDurationAvailable: boolean = false
    showSameVideoGuides: boolean = false

    interval: number | null

    declare guidesWithSameVideo: ExistingGuideHeadVso[]

    @AsyncComputedProp()
    async guidesWithSameVideo() {
        return backend.getGuidesByVideoId(this.videoId)
            .then(guides => guides.map(g => new ExistingGuideHeadVso(g)))
    }

    @AsyncComputedProp({
        watch: [
            'startSeconds',
            'endSeconds',
        ]
    })
    async intersectingGuides() {
        if (this.guidesWithSameVideo === null) {
            return []
        }
        return this.guidesWithSameVideo
            .filter(
                guide => guide.entry.parts.filter(
                    part => {
                        return part.part.kind === 'video' &&
                            part.part.excerpt.endSeconds >= (this.startSeconds + intersectionThresholdSeconds) &&
                            part.part.excerpt.startSeconds <= (this.endSeconds - intersectionThresholdSeconds)
                    }
                )
                    .length > 0
            )
            .map((head, index) => new TrainingGoalWidget(
                head,
                index,
                false,
                false,
            ))
    }

    closeAllIntersectingGuides() {
        for (let guide of this.intersectingGuides) {
            guide.open = false
        }
    }

    onSameVideoGuidesDropdownTap() {
        if (this.intersectingGuides.length > 0) {
            return this.showSameVideoGuides = !this.showSameVideoGuides;
        }
    }

    startCut() {
        this.startSeconds = this.player.getCurrentTime();
    }

    endCut() {
        this.endSeconds = this.player.getCurrentTime();
    }

    resetLoopWindow() {
        this.startSeconds = 0;
        this.endSeconds = this.durationSeconds;
    }

    onPlayerReady(player) {
        this.player = player;
        this.durationSeconds = player.getDuration();
        this.isVideoLoaded = true;
        this.$emit('playerReady', player)
    }

    onPlay() {
        // Duration may actually be slightly different
        // after video starts playing
        this.durationSeconds = this.player.getDuration();
        if (!this.preciseDurationAvailable) {
            this.preciseDurationAvailable = true;
            if (this.endSeconds === null) {
                this.endSeconds = this.durationSeconds
            }
        }
        this.currentSeconds = this.player.getCurrentTime();
        this.playing = true;
        const self = this;
        this.interval = setInterval(
            function () {
                self.currentSeconds = self.player.getCurrentTime();
            },
            16
        );
    }

    onSkip() {

    }

    onDragStart(drag) {
        this.player.pauseVideo();
        this.playerHasBeenPlaying = this.player.getPlayerState() === YT.PlayerState.PLAYING;
        this.player.seekTo(drag.start * this.durationSeconds, allowSeekAhead);
    }

    onDragContinue(drag) {
        this.setBoundsFromDrag(drag);
        this.player.seekTo(drag.end * this.durationSeconds, allowSeekAhead);
    }

    onDragEnd(drag) {
        this.setBoundsFromDrag(drag);
        if (this.playerHasBeenPlaying) {
            this.player.playVideo();
            this.playerHasBeenPlaying = null;
        }
    }

    onDraglessClick(clickCoord) {
        this.player.seekTo(
            this.clickCoordToSeconds(clickCoord),
            true
        );
    }

    setBoundsFromDrag(drag) {
        this.startSeconds = this.clickCoordToSeconds(
            Math.min(drag.start, drag.end)
        );
        this.endSeconds = this.clickCoordToSeconds(
            Math.max(drag.start, drag.end)
        );
    }

    clickCoordToSeconds(clickCoord) {
        return Number.parseFloat((this.durationSeconds * clickCoord).toFixed(2));
    }

    onPause() {
        this.currentSeconds = this.player.getCurrentTime();
        this.playing = false;
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    @Watch('startSeconds')
    onStartSecondsChange(value) {
        if (
            this.endSeconds !== null
            && this.endSeconds < value
        ) {
            this.endSeconds = value + 1;
        }
        if (value === this.endSeconds) {
            this.player.seekTo(value, allowSeekAhead);
            this.player.pauseVideo();
        }
        this.$emit('startSecondsChange', value);
    }

    @Watch('endSeconds')
    onEndSecondsChange(value) {
        this.$emit('endSecondsChange', value);
        if (this.startSeconds === value) {
            this.player.seekTo(value, allowSeekAhead);
            this.player.pauseVideo();
        }
    }

    @Watch('videoId')
    onVideoIdChange(value) {
        this.isVideoLoaded = false;
    }

    get startSecondsValidated(): number {
        return this.startSeconds;
    }

    set startSecondsValidated(value: number) {
        if (this.endSeconds >= value) {
            this.startSeconds = value
        }
    }

    get endSecondsValidated(): number {
        return this.endSeconds;
    }

    set endSecondsValidated(value: number) {
        if (this.startSeconds <= value) {
            this.endSeconds = value;
        }
    }

    private secondsToText(totalSeconds: number): string {
        const length = totalSeconds
        const hours = Math.floor(length / 3600);
        const minutes = Math.floor((length % 3600) / 60)
        const seconds = Math.floor(length % 60)
        const milliseconds = Math.round(length % 1 * 1000)
        const parts = [hours, minutes, seconds, milliseconds];
        if (hours !== 0) {
            return parts[0] + ' h ' + parts[1] + ' min';
        } else if (minutes !== 0) {
            return parts[1] + ' min ' + parts[2] + ' sec';
        } else if (seconds !== 0) {
            return parts[2] + '.' + parts[3].toString().padStart(3, '0') + ' sec';
        } else {
            return parts[3] + ' ms';
        }
    }

    get totalCutLengthText(): string {
        return this.secondsToText(this.endSeconds - this.startSeconds)
    }

    get relativePositionText() {
        return this.secondsToText(this.currentSeconds - this.startSeconds)
    }

    pasteHandler(event) {
        if (document.activeElement === document.body) {
            const match =
                event.clipboardData
                    .getData('text')
                    .match(/v=([^&]+)/);
            if (match === null || typeof match[1] == 'undefined') {
                return null;
            }
            this.videoId = match[1];
        }
    }

    mounted() {
        document.addEventListener('paste', this.pasteHandler);
    }

    beforeDestroy() {
        document.removeEventListener('paste', this.pasteHandler);
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/common.scss";
@import "~@/assets/css/fonts.scss";
@import "~@/assets/css/overwatch-ui.scss";

$start-color: hsl(230, 70%, 64%);
$end-color: hsl(0, 70%, 64%);


$max-portrait-mode-width: $root-content-width - 3rem;
.wrap {
    display: flex;
    justify-content: center;
}

.timebar {
    margin-bottom: .4em;
    margin-top: .4em;

    & ::v-deep .excerpt-area {
        background: rgb(78, 225, 255);
        background: linear-gradient(90deg, $start-color 0%, $end-color 100%);
    }
}

.video {
    max-width: 100%;
    margin-bottom: .4em;
}

.total-cut-length {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
}

.action-button {
    max-width: 3em;

    & ::v-deep .content {
        font-size: .6em;
        padding: .2em .4em;
    }
}

.left-shift-2 {
    margin-left: -3rem;
    margin-right: 3rem;
}

.left-shift-1 {
    margin-left: -1.5rem;
    margin-right: 1.5rem;
}

.left-shift-0 {
    margin-left: 1.5rem;
}

.controls {
    .time-input-group {
        .precise-time-input {
            height: 2.5em;
            display: flex;
            justify-content: center;
            margin-bottom: .4em;
        }

        margin-bottom: 1em;
    }

    .start-group {
        float: left;

        .time-input-start ::v-deep button .background {
            background-color: $start-color;
        }

        .cut-start ::v-deep .background {
            background-color: $start-color;
        }
    }

    .end-group {
        float: right;

        .time-input-end ::v-deep button .background {
            background-color: $end-color;
        }

        .cut-end ::v-deep .background {
            background-color: $end-color;
        }
    }

    .total-cut-group {
        button {
            margin: 0 .4em .2em .4em;
        }

        .total-cut-length {
            flex-basis: 100%;
            font-family: 'Futura Demi Bold', sans-serif;
            .hanging {
                display: inline;
                position: absolute;
                transform: translateX(-100%);
                white-space: pre;
            }
        }

        margin-bottom: 1.5em;
    }
}

.left-shift-0, .left-shift-1, .left-shift-2 {
    margin-left: 0;
    margin-right: 0;
}

.intersections {
    margin-bottom: 1em;
    margin-top: 1em;

    & ::v-deep .background {

        &:enabled {
            background-color: hsla(55, 80%, 50%, .6);
        }
    }

    img {
        display: inline-block !important;
    }
}

.same-video-guides {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

</style>
