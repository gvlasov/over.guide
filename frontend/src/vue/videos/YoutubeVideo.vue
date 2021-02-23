<template>
    <div class='youtube-video' v-bind:id="playerElementId"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class YoutubeVideo extends Vue {


    player: YT.Player
    timeout: number
    @Prop({required: true})
    videoId: string

    @Prop({default: null})
    start: number | null

    @Prop({default: null})
    end: number | null

    @Prop({default: false})
    loop: boolean

    @Prop({default: false})
    autoplay: boolean

    @Prop({
        required: false,
        default: '',
    })
    customPlayerElementId: string

    @Prop({default: true})
    enableControls: boolean

    @Prop({default: false})
    mute: boolean

    getDefaultPlayerElementId(): string {
        return 'youtube-player-' + this.videoId + '-' + this.start + '-' + this.end;
    }

    rescheduleLooping() {
        if (this.end !== null && this.player !== void 0) {
            this.tryClearingLoopTimeout();
            this.timeout = setTimeout(
                () => this.goToLoopStart(),
                (this.end - this.player.getCurrentTime()) * 1000 - 10
            );
        }
    }

    tryClearingLoopTimeout() {
        if (this.timeout !== void 0) {
            clearTimeout(this.timeout);
        }
    }

    goToLoopStart() {
        this.player.seekTo(this.start, true);
    }

    rebuildVideo(videoId) {
        if (this.player !== void 0) {
            this.player.destroy();
        }
        const self = this;
        let firstPlayWithoutAutoplay = !this.autoplay;
        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.defer = true;
        (document.head || document.body).appendChild(script);
        script.onload = function () {
            (window as any).YT.ready(function () {
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
                                self.$emit('play', self.player);
                            } else if (event.data === YT.PlayerState.PAUSED) {
                                self.tryClearingLoopTimeout();
                                self.$emit('pause', self.player);
                            }
                        }
                    }
                });
            });
        };
    }

    get playerElementId(): string {
        if (this.customPlayerElementId !== '') {
            return this.customPlayerElementId
        } else {
            return 'youtube-player-' + this.videoId + '-' + this.start + '-' + this.end;
        }
    }

    @Watch('start')
    onStartChange(value: number) {
        this.player.seekTo(value, true);
    }

    @Watch('end')
    onEndChange(value: number) {
        if (this.player !== void 0) {
            this.rescheduleLooping()
        }
        this.player.seekTo(Math.max((this.start ?? 0), value-1), true);
    }

    @Watch('loop')
    onLoopChange(value: boolean) {
        if (value === false) {
            this.tryClearingLoopTimeout();
        } else {
            this.rescheduleLooping();
        }
    }

    @Watch('videoId')
    onVideoIdChange(videoId: string) {
        this.rebuildVideo(videoId);
    }

    mounted() {
        if (document.querySelectorAll(`[id="${this.playerElementId}"]`).length > 1) {
            throw new Error(
                `Player element with id = ${this.playerElementId} is not unique`
            )
        }
        this.rebuildVideo(this.videoId);
    }
};

</script>

<style scoped>
</style>
