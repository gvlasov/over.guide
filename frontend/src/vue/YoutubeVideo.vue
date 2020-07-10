<template>
    <div v-bind:id="elementId"></div>
</template>

<script>
    export default {
        name: 'YoutubeVideo',
        data() {
            return {
                player: undefined,
                timeout: undefined,
            }
        },
        props: {
            videoId: {
                type: String
            },
            start: {
                type: Number,
                default: null,
            },
            end: {
                type: Number,
                default: null,
            },
            loop: {
                type: Boolean,
                default: false,
            },
            autoplay: {
                type: Boolean,
                default: false,
            },
            width: {
                type: Number,
                default: 640
            },
            playerElementId: {
                type: String,
                default: () => undefined
            }
        },
        methods: {
            rescheduleLooping() {
                if (this.end !== null) {
                    this.tryClearingLoopTimeout();
                    this.timeout = setTimeout(
                        () => this.goToLoopStart(),
                        (this.end - this.player.getCurrentTime()) * 1000 - 10
                    );
                }
            },
            tryClearingLoopTimeout() {
                if (typeof this.timeout !== 'undefined') {
                    clearTimeout(this.timeout);
                }
            },
            goToLoopStart() {
                this.player.seekTo(this.start);
            },
            rebuildVideo(videoId) {
                if (typeof this.player !== 'undefined') {
                    this.player.destroy();
                }
                const self = this;
                var script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.defer = true;
                (document.head || document.body).appendChild(script);
                script.onload = function () {
                    window.YT.ready(function () {
                        self.player = new YT.Player(self.elementId, {
                            videoId: videoId,
                            playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                autoplay: self.autoplay,
                            },
                            height: self.width / 640 * 390,
                            width: self.width,
                            events: {
                                'onReady': (event) => {
                                    self.goToLoopStart();
                                    if (self.autoplay) {
                                        self.player.playVideo();
                                    } else {
                                        self.player.pauseVideo();
                                    }
                                    self.$emit('playerReady', self.player)
                                },
                                'onStateChange': (event) => {
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        self.rescheduleLooping();
                                        self.$emit('play');
                                    } else if (event.data === YT.PlayerState.PAUSED) {
                                        self.tryClearingLoopTimeout();
                                        self.$emit('pause');
                                    }
                                }
                            }
                        });
                    });
                };
            }
        },
        computed: {
            elementId() {
                if (typeof this.playerElementId === 'undefined') {
                    return 'youtube-player-' + this.videoId + '-' + this.start + '-' + this.end;
                } else {
                    return this.playerElementId;
                }
            },
        },
        watch: {
            start(value) {
                this.player.seekTo(value);
            },
            end(value) {
                if (typeof this.player !== 'undefined') {
                    this.rescheduleLooping()
                }
            },
            loop(value) {
                if (value === false) {
                    this.tryClearingLoopTimeout();
                } else {
                    this.rescheduleLooping();
                }
            },
            videoId(videoId) {
                this.rebuildVideo(videoId);
            }
        },
        mounted() {
            this.rebuildVideo(this.videoId);
        },
    };

</script>

<style scoped>
</style>
