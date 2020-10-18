<template>
    <div>
        <AspectRatioBox
                v-observe-visibility="{
        callback: onVisibilityChanged,
        intersection: {
            rootMargin: '50px',
            threshold: 1.0
        }
    }"
                ref="root"
        >
            <VideoLoadingScreen
                    :excerpt="part.excerpt"
                    v-hammer:tap="() => showPreload = false"
            />
            <YoutubeVideo
                    v-if="!showPreload"
                    ref="video"
                    :video-id="part.excerpt.youtubeVideoId"
                    :start="part.excerpt.startSeconds"
                    :end="part.excerpt.endSeconds"
                    :loop="true"
                    :autoplay="true"
                    :mute="false"
                    :custom-player-element-id="playerId"
                    @play="onPlay"
                    @pause="onPause"
                    @playerReady="(player) => $emit('playerReady', player)"
                    class="video"
            />
        </AspectRatioBox>
        <div
                v-if="!showPreload"
                class="video-custom-ui"
        >
            <GuideVideoExcerptTimebar
                    :start-seconds="0"
                    :end-seconds="0"
                    :current-seconds="currentSeconds-part.excerpt.startSeconds"
                    :duration-seconds="durationSeconds"
                    :enable-slider-label="false"
                    :enable-drag-behavior="false"
                    @draglessClick="onDraglessClick"
            />
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import AspectRatioBox from "@/vue/AspectRatioBox";
import VideoLoadingScreen from "@/vue/VideoLoadingScreen";
import Vue from 'vue'
import {Prop, Ref} from "vue-property-decorator";
import Component from "vue-class-component";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";
import ExcerptTimebar from "@/vue/videos/ExcerptTimebar.vue";
import GuideVideoExcerptTimebar
    from "@/vue/guides/GuideVideoExcerptTimebar.vue";

let guideVideoUid = 0;
@Component({
    components: {
        GuideVideoExcerptTimebar,
        ExcerptTimebar,
        VideoLoadingScreen,
        AspectRatioBox,
        YoutubeVideo,
    },
})
export default class GuideVideo extends Vue {
    @Ref('video')
    readonly video: YoutubeVideo

    @Ref('root')
    readonly root: HTMLElement

    @Prop({required: true})
    entry: GuideHistoryEntryVso

    @Prop({required: true})
    part: GuidePartVideoDto

    @Prop({required: true})
    index: number

    @Prop({required: true})
    initialShowPreload: boolean

    showPreload: boolean = true

    currentSeconds: number = this.part.excerpt.startSeconds

    interval: number | null = null

    guideVideoUid: number = guideVideoUid++;

    declare $refs!: {
        root: HTMLElement
    }

    onPlay(player: YT.Player) {
        this.$emit('play', player)
        this.interval = setInterval(() => {
            this.currentSeconds = player.getCurrentTime()
        }, 16)
    }

    onPause(player: YT.Player) {
        if (this.interval !== null) {
            clearInterval(this.interval)
            this.interval = null
        }
    }

    onPlayPauseTap() {
        if (this.video.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.video.player.pauseVideo()
        } else {
            this.video.player.playVideo()
        }
    }

    onDraglessClick(clickCoord) {
        this.video.player.seekTo(
            this.clickCoordToSeconds(clickCoord),
            true
        );
    }


    clickCoordToSeconds(clickCoord) {
        return this.part.excerpt.startSeconds + Number.parseFloat((this.durationSeconds * clickCoord).toFixed(2));
    }

    get durationSeconds(): number {
        return this.part.excerpt.endSeconds - this.part.excerpt.startSeconds
    }

    autoplayVideoHandle: Object

    created() {
        this.autoplayVideoHandle = {
            playerId: () => {
                return this.playerId;
            },
            boundingClientRect: () => {
                return this.$el.getBoundingClientRect()
            },
            play: () => {
                if (this.showPreload) {
                    this.showPreload = false;
                } else if (
                    this.video !== void 0
                    && this.video.player !== void 0
                ) {
                    this.video.player.playVideo()
                }
            },
            pause: () => {
                if (
                    !this.showPreload
                    && this.video !== void 0
                    && this.video.player !== void 0
                    && this.video.player.pauseVideo !== void 0
                ) {
                    this.video.player.pauseVideo()
                }
            },
        }
    }

    get playerId() {
        return 'GuideVideo' + this.guideVideoUid + '-' + this.index + '-' + this.part.excerpt.youtubeVideoId
    }

    onVisibilityChanged(isVisible, entry) {
        if (isVisible) {
            this.$emit('comesIntoVision', this.autoplayVideoHandle)
        } else {
            this.$emit('comesOutOfVision', this.autoplayVideoHandle)
        }
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/common.scss";
@import "~@/assets/css/fonts.scss";
@import "~@/assets/css/overwatch-ui.scss";

.video-custom-ui {
    $start-color: hsl(230, 70%, 64%);
    $end-color: hsl(0, 70%, 64%);

    $max-portrait-mode-width: $root-content-width - 3rem;

    .play-pause {
        background-color: hsla(0, 50%, 40%, .4);
    }

    .excerpt-timebar {
        height: 1.5em;
        margin-bottom: .4em;
        margin-top: .4em;

        & ::v-deep .excerpt-area {
            background: rgb(78, 225, 255);
            background: linear-gradient(90deg, $start-color 0%, $end-color 100%);
        }
    }
}

.loading-screen {
    cursor: pointer;
}
</style>
