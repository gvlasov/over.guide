<template>
    <div class="wrap">
        <div class="controls">
            <label>URL<input v-model.trim="videoUrl"/></label>
            <label v-if="isVideoLoaded">Start, s
                <PreciseTimeInput
                        v-model="startSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                />
            </label>
            <label v-if="isVideoLoaded">End, s
                <PreciseTimeInput
                        v-model="endSecondsValidated"
                        :show-hours="durationSeconds > 3600"
                />
            </label>
            <label v-if="isVideoLoaded">Loop<input v-model="loop" type="checkbox"/></label>
            <div>Tip: paste video URL anywhere on this page to load the video!</div>
        </div>
        <div>
            <YoutubeVideo
                    :videoId="videoId"
                    :start="startSeconds"
                    :end="endSeconds"
                    :loop="loop"
                    @playerReady="onPlayerReady"
                    @play="onPlay"
                    @pause="onPause"
                    @skip="onSkip"
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
            onPlayerReady(player) {
                this.player = player;
                this.durationSeconds = player.getDuration();
                this.startSeconds = 0;
                this.endSeconds = player.getDuration();
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
                videoUrl: 'https://www.youtube.com/watch?v=raZhJt0fCOI',
                // videoUrl: '',
                startSeconds: 7,
                endSeconds: 12,
                durationSeconds: null,
                currentSeconds: 0,
                player: null,
                loop: true,
                playing: false,
                hovered: false,
                playerHasBeenPlaying: null,
                pasteHandler: null,
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
            endSeconds(value) {
                if (this.loop) {
                    this.loop = true;
                }
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
            /**
             * @return {boolean}
             */
            isVideoLoaded() {
                return this.videoId !== null;
            }
        },
        mounted() {
            const self = this;
            this.pasteHandler = (event) => {
                console.log(document.activeElement);
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
        text-align: right;
    }

    .controls > label {
        display: block;
        white-space: nowrap;
        padding: .5em;
        font-family: sans-serif;
    }

    .controls > label > input {
        margin-left: .5em;
    }
</style>
