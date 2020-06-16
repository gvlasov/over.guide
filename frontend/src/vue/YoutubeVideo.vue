<template>
    <div v-bind:id="elementId"></div>
</template>

<script>
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
            }
        },
        methods: {},
        computed: {
            elementId() {
                return 'youtube-player-' + this.videoId;
            },
        },
        mounted() {
            const self = this;
            var script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.defer = true;
            (document.head || document.body).appendChild(script);

            var player;
            var timeout;

            function onPlayerReady(event) {
                goToLoopStart();
                if (self.autoplay) {
                    player.playVideo();
                }
            }

            function tryClearingLoopTimeout() {
                if (typeof timeout !== 'undefined') {
                    clearTimeout(timeout);
                }
            }

            function goToLoopStart() {
                player.seekTo(self.start);
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    if (self.end !== null) {
                        tryClearingLoopTimeout();
                        timeout = setTimeout(
                            goToLoopStart,
                            (self.end - player.getCurrentTime()) * 1000
                        );
                    }
                } else if (event.data === YT.PlayerState.PAUSED) {
                    tryClearingLoopTimeout();
                }
            }

            script.onload = function () {
                window.YT.ready(function () {
                    player = new YT.Player(self.elementId, {
                        height: '390',
                        width: '640',
                        videoId: self.videoId,
                        startSeconds: self.start,
                        endSeconds: self.end,
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                });
            };
        },
        data() {
            return {}
        },
    };

</script>

<style scoped>
</style>
