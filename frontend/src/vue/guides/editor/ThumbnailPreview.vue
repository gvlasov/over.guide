<template>
    <div class="thumbnail-preview">
        <VideoFrameViewer
                v-if="excerpt.thumbnail >= 0"
                :time-seconds="excerpt.thumbnail"
                :youtube-video-id="excerpt.youtubeVideoId"
                @seeking="loading = true"
                @seeked="loading = false"
                v-bind:class="loading ? 'loading' : ''"
        />
        <div class="loading-notice" v-if="loading">loading</div>
        <YoutubeThumbnail
                v-if="excerpt.thumbnail === OriginalThumbnail"
                :video-id="excerpt.youtubeVideoId"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import VideoFrameViewer from "@/vue/videos/VideoFrameViewer.vue";
import YoutubeVideoExcerptDto, {YoutubeVideoExcerptDtoExternal} from "data/dto/YoutubeVideoExcerptDto";
import YoutubeThumbnail from "@/vue/videos/YoutubeThumbnail.vue";


@Component({
    components: {
        YoutubeThumbnail,
        VideoFrameViewer
    }
})
export default class ThumbnailPreview extends Vue {

    @Prop({required: true})
    excerpt: YoutubeVideoExcerptDto

    loading: boolean = false

    OriginalThumbnail = YoutubeVideoExcerptDtoExternal.Original

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/fonts.scss";
@import "~@/assets/css/overwatch-ui.scss";

.thumbnail-preview {
    user-select: none;
    pointer-events: none;
    overflow: hidden;

    .loading-notice {
        position: absolute;
        text-shadow: 0 0 2px #313131;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-basis: 100%;
        flex-direction: column;
        z-index: 2;
        justify-content: center;
        align-items: center;
        font-family: 'BigNoodleTooOblique', 'sans-serif';
        font-size: 3em;
    }

    .video-frame-viewer {
        z-index: 1;
        height: 100%;
        opacity: 1;
        filter: blur(0px);
        transition: opacity .1s, filter .1s;
        &.loading {
            transition: opacity .3s, filter .3s;
            opacity: .5;
            filter: blur(4px);
        }
    }
}

</style>
