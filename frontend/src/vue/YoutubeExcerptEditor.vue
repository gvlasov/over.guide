<template>
    <div class="wrap">
        <div class="controls">
            <label>URL<input v-model.trim="videoUrl"/></label>
            <label>Start, s<input v-model.number="startSeconds" type="number" step=".05"/></label>
            <label>End, s<input v-model.number="endSeconds" type="number" step=".05"/></label>
            <label>Loop<input v-model="loop" type="checkbox"/></label>

        </div>
        <div>
            <YoutubeVideo
                    v-if="videoId !== null"
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

    export default {
        name: 'YoutubeExcerptEditor',
        props: {},
        methods: {
            onPlayerReady(player) {
                if (!this.loop) {
                    this.end = player.getDuration();
                }
                this.player = player;
                this.durationSeconds = player.getDuration();
            },
            onPlay() {
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
                videoUrl: 'https://www.youtube.com/watch?v=668nUCeBHyY',
                // videoUrl: '',
                startSeconds: 8,
                endSeconds: 9,
                durationSeconds: null,
                currentSeconds: 0,
                player: null,
                loop: true,
                playing: false,
                hovered: false,
                playerHasBeenPlaying: null,
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
            loop(value) {
                if (value === false) {
                    this.endSeconds = this.durationSeconds;
                }
            },
            endSeconds(value) {
                if (this.loop) {
                    this.loop = true;
                }
            }
        },
        computed: {
            videoId() {
                if (this.videoUrl === '') {
                    return null;
                }
                var match = this.videoUrl.match(/v=([^&]+)/);
                if (typeof match[1] == 'undefined') {
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
        },
        components: {
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
