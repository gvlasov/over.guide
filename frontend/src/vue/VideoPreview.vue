<template>
    <div class="video-preview">
        <img
                :src="thumbnailUrl"
                @load="() => videoFallback = false"
                @abort="() => videoFallback = true"
                @error="() => videoFallback = true"
        />
        <VideoFrameViewer
                v-if="videoFallback"
                :time-seconds="excerpt.thumbnail"
                :youtube-video-id="excerpt.youtubeVideoId"
        />
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import YoutubeVideoExcerptDto, {YoutubeVideoExcerptDtoExternal} from "data/dto/YoutubeVideoExcerptDto";
import VideoFrameViewer from "@/vue/videos/VideoFrameViewer.vue";

@Component({
    components: {VideoFrameViewer}
})
export default class VideoPreview extends Vue {

    @Prop({required: true})
    excerpt: YoutubeVideoExcerptDto

    private videoFallback: boolean = false

    get thumbnailUrl(): string {
        if (this.excerpt.thumbnail === YoutubeVideoExcerptDtoExternal.Original) {
            return this.originalThumbnailUrl
        } else if (this.excerpt.thumbnail >= 0) {
            return this.customThumbnailUrl
        }
    }

    get originalThumbnailUrl(): string {
        return `https://i3.ytimg.com/vi/${this.excerpt.youtubeVideoId}/mqdefault.jpg`
    }

    get customThumbnailUrl(): string {
        return process.env.CDN_BASE_URL + '/images/custom-thumbnails/' + this.excerpt.id + '.jpg'
    }

};

</script>

<style lang="scss" scoped>
.video-preview {
    background-color: #111;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
}
</style>
