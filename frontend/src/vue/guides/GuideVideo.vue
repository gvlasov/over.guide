<template>
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
                :player-element-id="playerId"
                @play="(player) => $emit('play', player)"
                @playerReady="(player) => $emit('playerReady', player)"
                class="video"
        />
    </AspectRatioBox>
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

let guideVideoUid = 0;
@Component({
    components: {
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

    declare $refs!: {
        root: HTMLElement
    }

    autoplayVideoHandle: Object

    created() {
        guideVideoUid++;
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
        return 'GuideVideo' + guideVideoUid + '-' + this.index + '-' + this.part.excerpt.youtubeVideoId
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
.loading-screen {
    cursor: pointer;
}
</style>
