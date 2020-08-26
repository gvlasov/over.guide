<template>
    <div class='youtube-video' v-bind:id="playerElementId"></div>
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
            playerElementId: {
                type: String,
                default: () => {
                    return 'youtube-player-' + this.videoId + '-' + this.start + '-' + this.end;
                }
            },
            enableControls: {
                type: Boolean,
                default: true,
            },
            mute: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            rescheduleLooping() {
                if (this.end !== null && this.player !== undefined) {
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
                let firstPlayWithoutAutoplay = !this.autoplay;
                var script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.defer = true;
                (document.head || document.body).appendChild(script);
                script.onload = function () {
                    window.YT.ready(function () {
                        self.player = new YT.Player(self.playerElementId, {
                            videoId: videoId,
                            playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                autoplay: self.autoplay ? 1 : 0,
                                disablekb: self.enableControls ? 0 : 1,
                                controls: self.enableControls ? 1 : 0,
                            },
                            width: null,
                            height: null,
                            events: {
                                'onReady': (event) => {
                                    self.goToLoopStart();
                                    if (self.autoplay) {
                                        self.player.playVideo();
                                    } else {
                                        // self.player.pauseVideo();
                                        /*
                                         If I use pauseVideo here, Mobile player
                                         breaks on both actual Android and Chrome
                                         Dev Tools device mode, and it breaks in
                                         the same way: doesn't load video at all,
                                         showing a broken square icon
                                         */
                                    }
                                    if (self.mute) {
                                        self.player.mute();
                                    }
                                    self.$emit('playerReady', self.player)
                                },
                                'onStateChange': (event) => {
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        if (firstPlayWithoutAutoplay) {
                                            firstPlayWithoutAutoplay = false;
                                            self.player.pauseVideo();
                                        }
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
            if (document.querySelectorAll(`[id="${this.playerElementId}"]`).length > 1) {
                throw new Error(
                    `Player element with id = ${this.playerElementId} is not unique`
                )
            }
            this.rebuildVideo(this.videoId);
        },
    };

</script>

<style scoped>
</style>
