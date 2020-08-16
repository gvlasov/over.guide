<template>
    <div class="wrap">
        <div>
            <YoutubeVideo
                    :videoId="videoId"
                    :start="startSeconds"
                    :end="endSeconds"
                    :loop="true"
                    :autoplay="true"
                    :player-element-id="playerElementId"
                    @playerReady="onPlayerReady"
                    @play="onPlay"
                    @pause="onPause"
                    @skip="onSkip"
                    class="video"
                    v-bind:style="'width: '+videoCssWidth+'; height: '+videoCssHeight"
            />
            <div>
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
            <div class="controls">
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model="startSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="endSeconds"
                        :min-seconds="0"
                />
                <div class="crop-buttons">
                    <OverwatchPanelButton
                            class="reset-button"
                            v-hammer:tap="resetLoopWindow"
                            title="Reset loop window to entire video"
                            type="default"
                    >-] [-
                    </OverwatchPanelButton>
                    <OverwatchPanelButton
                            class="start-cut"
                            v-hammer:tap="startCut"
                            title="Start loop at current position"
                            type="default"
                    >[
                    </OverwatchPanelButton>
                    <OverwatchPanelButton
                            class="end-cut"
                            v-hammer:tap="endCut"
                            title="End loop at current position"
                            type="default"
                    >]
                    </OverwatchPanelButton>
                </div>
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model="endSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="durationSeconds"
                        :min-seconds="startSeconds"
                />
                <div class="total-cut-length">{{totalCutLengthText}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import ExcerptTimebar from "@/vue/videos/ExcerptTimebar.vue";
    import PreciseTimeInput from "@/vue/videos/PreciseTimeInput.vue";
    import Backend from "@/js/Backend";
    import axios from "axios";
    import OverwatchButton from "@/vue/OverwatchButton";
    import OverwatchPanelButton from "@/vue/OverwatchPanelButton";

    const backend = new Backend(axios);
    export default {
        props: {
            videoId: {
                type: String,
                required: true,
            },
            initialStartSeconds: {
                type: Number,
                required: true,
            },
            initialEndSeconds: {
                type: Number,
                required: true,
            },
            playerElementId: {
                type: String
            },
            videoCssWidth: {
                type: String,
                default: '640px'
            },
            videoCssHeight: {
                type: String,
                default: '390px'
            },
        },
        data() {
            return {
                startSeconds: this.initialStartSeconds,
                endSeconds: this.initialEndSeconds,
                durationSeconds: null,
                currentSeconds: 0,
                player: null,
                playing: false,
                hovered: false,
                playerHasBeenPlaying: null,
                pasteHandler: null,
                isVideoLoaded: false,
            }
        },
        methods: {
            startCut() {
                this.startSeconds = this.player.getCurrentTime();
            },
            endCut() {
                this.endSeconds = this.player.getCurrentTime();
            },
            resetLoopWindow() {
                this.startSeconds = 0;
                this.endSeconds = this.durationSeconds;
            },
            onPlayerReady(player) {
                this.player = player;
                this.durationSeconds = player.getDuration();
                // this.startSeconds = 0;
                // this.endSeconds = player.getDuration();
                this.isVideoLoaded = true;
            },
            onPlay() {
                // Duration may actually be slightly different
                // after video starts playing
                this.durationSeconds = this.player.getDuration();
                this.currentSeconds = this.player.getCurrentTime();
                this.playing = true;
                const self = this;
                this.interval = setInterval(
                    function () {
                        self.currentSeconds = self.player.getCurrentTime();
                    },
                    16
                );
            },
            onSkip() {

            },
            onDragStart(drag) {
                this.player.pauseVideo();
                this.playerHasBeenPlaying = this.player.getPlayerState() === YT.PlayerState.PLAYING;
                this.player.seekTo(drag.start * this.durationSeconds);
            },
            onDragContinue(drag) {
                this.setBoundsFromDrag(drag);
                this.player.seekTo(drag.end * this.durationSeconds);
            },
            onDragEnd(drag) {
                this.setBoundsFromDrag(drag);
                if (this.playerHasBeenPlaying) {
                    this.player.playVideo();
                    this.playerHasBeenPlaying = null;
                }
            },
            onDraglessClick(clickCoord) {
                this.player.seekTo(this.clickCoordToSeconds(clickCoord));
            },
            setBoundsFromDrag(drag) {
                this.startSeconds = this.clickCoordToSeconds(
                    Math.min(drag.start, drag.end)
                );
                this.endSeconds = this.clickCoordToSeconds(
                    Math.max(drag.start, drag.end)
                );
            },
            clickCoordToSeconds(clickCoord) {
                return Number.parseFloat((this.durationSeconds * clickCoord).toFixed(2));
            },
            onPause() {
                this.currentSeconds = this.player.getCurrentTime();
                this.playing = false;
                if (this.interval !== null) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            },
        },
        watch: {
            startSeconds(value) {
                if (
                    this.endSeconds !== null
                    && this.endSeconds < value
                ) {
                    this.endSeconds = value + 1;
                }
                if (value === this.endSeconds) {
                    this.player.seekTo(value);
                    this.player.pauseVideo();
                }
                this.$emit('startSecondsChange', value);
            },
            endSeconds(value) {
                this.player.seekTo(value - 1);
                this.$emit('endSecondsChange', value);
                if (this.startSeconds === value) {
                    this.player.seekTo(value);
                    this.player.pauseVideo();
                }
            },
            videoId(value) {
                this.isVideoLoaded = false;
            }
        },
        computed: {
            startSecondsValidated: {
                get() {
                    return this.startSeconds;
                },
                set(value) {
                    if (value === '') {
                        value = 0;
                    } else {
                        value = Number.parseFloat(value)
                    }
                    if (this.endSeconds >= value) {
                        this.startSeconds = value
                    }
                }
            },
            endSecondsValidated: {
                get() {
                    return this.endSeconds;
                },
                set(value) {
                    if (value === '') {
                        value = 0;
                    } else {
                        value = Number.parseFloat(value)
                    }
                    if (this.startSeconds <= value) {
                        this.endSeconds = value;
                    }
                }
            },
            totalCutLengthText() {
                const length = this.endSeconds - this.startSeconds;
                const hours = Math.floor(length / 3600);
                const minutes = Math.floor((length % 3600) / 60)
                const seconds = Math.floor(length % 60)
                const milliseconds = Math.floor(length % 1 * 1000)
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
            },
        },
        mounted() {
            const self = this;
            this.pasteHandler = (event) => {
                if (document.activeElement === document.body) {
                    const clipboardContent =
                        (event.clipboardData || window.clipboardData).getData('text');

                    var match = clipboardContent.match(/v=([^&]+)/);
                    if (match === null || typeof match[1] == 'undefined') {
                        return null;
                    }
                    self.videoId = match[1];
                }
            };
            document.addEventListener('paste', this.pasteHandler);
        },
        beforeDestroy() {
            if (this.pasteHandler !== null) {
                document.removeEventListener('paste', this.pasteHandler);
            }
        },
        components: {
            OverwatchButton,
            OverwatchPanelButton,
            PreciseTimeInput,
            YoutubeVideo,
            ExcerptTimebar,
        }
    };

</script>

<style scoped>
    .wrap {
        display: flex;
        justify-content: center;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: .4em;
    }

    .timebar {
        margin-bottom: .4em;
    }

    .crop-buttons {
        display: inline-flex;
        gap: .3em;
        height: min-content;
    }

    .video {
        max-width: 100%;
        margin-bottom: .4em;
    }
</style>
