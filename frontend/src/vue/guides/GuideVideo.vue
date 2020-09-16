<template>
        <AspectRatioBox v-if="part.kind === 'video'">
            <VideoLoadingScreen
                    :excerpt="part.excerpt"
                    v-hammer:tap="() => showPreload = false"
            />
            <YoutubeVideo
                    v-if="!showPreload"
                    :video-id="part.excerpt.youtubeVideoId"
                    :start="part.excerpt.startSeconds"
                    :end="part.excerpt.endSeconds"
                    :loop="true"
                    :autoplay="true"
                    :mute="false"
                    :player-element-id="guide.guideId + '-' + index +'-'+ part.excerpt.youtubeVideoId"
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

    },
    data() {
        return {
            showPreload: this.initialShowPreload,
        }
    },
    computed: {
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
