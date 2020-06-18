<template>
    <div v-bind:id="elementId"></div>
</template>

<script>
    var player;
    var timeout;
    export default {
        name: 'YoutubeVideo',
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
        },
        methods: {
            rescheduleLooping() {
                if (this.end !== null) {
                    this.tryClearingLoopTimeout();
                    timeout = setTimeout(
                        () => this.goToLoopStart(),
                        (this.end - player.getCurrentTime()) * 1000 - 10
                    );
                }
            },
            tryClearingLoopTimeout() {
                if (typeof timeout !== 'undefined') {
                    clearTimeout(timeout);
                }
            },
            goToLoopStart() {
                player.seekTo(this.start);
            },
            rebuildVideo(videoId) {
                if (typeof player !== 'undefined') {
                    player.destroy();
                }
                const self = this;
                var script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.defer = true;
                (document.head || document.body).appendChild(script);
                script.onload = function () {
                    window.YT.ready(function () {
                        player = new YT.Player(self.elementId, {
                            videoId: videoId,
                            playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                autoplay: self.autoplay,
                            },
                            height: '390',
                            width: '640',
                            events: {
                                'onReady': (event) => {
                                    self.goToLoopStart();
                                    if (self.autoplay) {
                                        player.playVideo();
                                    } else {
                                        player.pauseVideo();
                                    }
                                    self.$emit('playerReady', player)
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
                return 'youtube-player-' + this.videoId;
            },
        },
        watch: {
            start(value) {
                player.seekTo(value);
            },
            end(value) {
                if (typeof player !== 'undefined') {
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
        data() {
            return {}
        },
    };

</script>

<style scoped>
</style>
