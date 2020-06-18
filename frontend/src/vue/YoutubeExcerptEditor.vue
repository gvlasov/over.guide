<template>
    <div class="wrap">
        <div>
            <YoutubeVideo
                    :videoId="videoId"
                    :start="startSeconds"
                    :end="endSeconds"
                    :loop="true"
                    :autoplay="false"
                    @playerReady="onPlayerReady"
                    @play="onPlay"
                    @pause="onPause"
                    @skip="onSkip"
                    style="margin-bottom: .4em;"
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
                        class="timebar"
                />
            </div>
            <div class="controls">
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model="startSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="durationSeconds"
                />
                <div class="crop-buttons">
                    <button
                            class="reset-button"
                            @click="resetLoopWindow"
                            title="Reset loop window to entire video"
                    ><img src="/icons/clear-selection.svg" class="button-icon"/>
                    </button>
                    <button
                            class="start-cut"
                            @click="startCut"
                            title="Start loop at current position"
                    >[
                    </button>
                    <button
                            class="end-cut"
                            @click="endCut"
                            title="End loop at current position"
                    >]
                    </button>
                </div>
                <PreciseTimeInput
                        v-if="isVideoLoaded"
                        v-model="endSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                        :current-time-seconds="currentSeconds"
                        :max-seconds="durationSeconds"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "./YoutubeVideo.vue";
    import ExcerptTimebar from "./ExcerptTimebar.vue";
    import PreciseTimeInput from "./PreciseTimeInput.vue";

    export default {
        name: 'YoutubeExcerptEditor',
        props: {},
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
                this.startSeconds = 0;
                this.endSeconds = player.getDuration();
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
                    this.player.seekTo(drag.start * this.durationSeconds);
                }
            },
            setBoundsFromDrag(drag) {
                const start = Math.min(drag.start, drag.end);
                const end = Math.max(drag.start, drag.end);
                this.startSeconds = Number.parseFloat((this.durationSeconds * start).toFixed(2));
                this.endSeconds = Number.parseFloat((this.durationSeconds * end).toFixed(2));
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
        data() {
            return {
                videoUrl: 'https://www.youtube.com/watch?v=1Oq-jvwQEj4',
                // videoUrl: '',
                startSeconds: 7,
                endSeconds: 12,
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
        watch: {
            startSeconds(value) {
                if (
                    this.endSeconds !== null
                    && this.endSeconds < value
                ) {
                    this.endSeconds = value + 1;
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
                    if (this.endSeconds > value) {
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
                    if (this.startSeconds < value) {
                        this.endSeconds = value;
                    }
                }
            },
            videoId() {
                if (this.videoUrl === '') {
                    return null;
                }
                var match = this.videoUrl.match(/v=([^&]+)/);
                if (match === null || typeof match[1] == 'undefined') {
                    return null;
                }
                return match[1];
            },
        },
        mounted() {
            const self = this;
            this.pasteHandler = (event) => {
                if (document.activeElement === document.body) {
                    const clipboardContent =
                        (event.clipboardData || window.clipboardData).getData('text');
                    self.videoUrl = clipboardContent;
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
            PreciseTimeInput: PreciseTimeInput,
            YoutubeVideo: YoutubeVideo,
            ExcerptTimebar: ExcerptTimebar
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
    }

    .timebar {
        margin-bottom: .4em;
    }

    .crop-buttons {
        display: inline-block;
    }

    .crop-buttons > button {
        width: 2em;
        height: 2em;
        vertical-align: top;
    }

    .button-icon {
        width: 100%;
        height: 100%;
    }
</style>
