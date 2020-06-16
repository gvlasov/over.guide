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
            />
            <div>
                <ExcerptTimebar
                        :start-seconds="1"
                        :end-seconds="10"
                        :current-seconds="4"
                        :duration-seconds="10"
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
                this.durationSeconds = player.getDuration();
            }
        },
        data() {
            return {
                // videoUrl: 'https://www.youtube.com/watch?v=l6Wx75RYBEM',
                videoUrl: '',
                startSeconds: 8,
                endSeconds: 9,
                durationSeconds: null,
                loop: true,
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
