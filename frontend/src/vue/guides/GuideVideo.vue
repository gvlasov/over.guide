<template>
    <AspectRatioBox
            v-observe-visibility="{
        callback: onVisibilityChanged,
        intersection: {
            rootMargin: '50px',
            threshold: 1.0
        }
    }"
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

<script>
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import GuideVso from "@/js/vso/GuideVso";
import AspectRatioBox from "@/vue/AspectRatioBox";
import VideoLoadingScreen from "@/vue/VideoLoadingScreen";

export default {
    props: {
        guide: {
            type: GuideVso,
            required: true
        },
        part: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        initialShowPreload: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        onVisibilityChanged(isVisible, entry) {
            if(isVisible) {
                this.$emit('comesIntoVision', this.autoplayVideoHandle)
            } else {
                this.$emit('comesOutOfVision', this.autoplayVideoHandle)
            }
        },
    },
    data() {
        return {
            showPreload: this.initialShowPreload,
            autoplayVideoHandle: {
                playerId() {
                    return this.playerId;
                },
                boundingClientRect: () => {
                    return this.$el.getBoundingClientRect()
                },
                play: () => {
                    if (this.showPreload) {
                        this.showPreload = false;
                    } else {
                        this.$refs.video.player.playVideo()
                    }
                },
                pause: () => {
                    if (
                        !this.showPreload
                        && typeof this.$refs.video.player !== 'undefined'
                    ) {
                        try {
                            this.$refs.video.player.pauseVideo()
                        } catch(e) {
                            console.log(this.$refs.video.player)
                        }
                    }
                },
            },
        }
    },
    computed: {
        playerId() {
            return this.guide.guideId + '-' + this.index +'-'+ this.part.excerpt.youtubeVideoId
        },
    },
    components: {
        VideoLoadingScreen,
        AspectRatioBox,
        YoutubeVideo,
    },
};

</script>

<style lang="scss" scoped>
.loading-screen {
    cursor: pointer;
}
</style>
