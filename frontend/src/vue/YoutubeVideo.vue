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
                this.rescheduleLooping()
            },
            loop(value) {
                if (value === false) {
                    this.tryClearingLoopTimeout();
                } else {
                    this.rescheduleLooping();
                }
            },
        },
        mounted() {
            const self = this;
            var script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.defer = true;
            (document.head || document.body).appendChild(script);
            script.onload = function () {
                window.YT.ready(function () {
                    player = new YT.Player(self.elementId, {
                        videoId: self.videoId,
                        playerVars: {
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                            start: 3,
                            end: 20,
                        },
                        height: '390',
                        width: '640',
                        events: {
                            'onReady': (event) => {
                                self.goToLoopStart();
                                if (self.autoplay) {
                                    player.playVideo();
                                }
                                self.$emit('playerReady', player)
                            },
                            'onStateChange': (event) => {
                                if (event.data === YT.PlayerState.PLAYING) {
                                    self.rescheduleLooping()
                                } else if (event.data === YT.PlayerState.PAUSED) {
                                    self.tryClearingLoopTimeout();
                                }
                            }
                        }
                    });
                });
            };
        }
        ,
        data() {
            return {}
        }
        ,
    }
    ;

</script>

<style scoped>
</style>
