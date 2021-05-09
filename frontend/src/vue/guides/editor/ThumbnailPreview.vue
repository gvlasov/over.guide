<template>
    <div class="thumbnail-preview">
        <VideoFrameViewer
                v-if="excerpt.thumbnail >= 0"
                :time-seconds="excerpt.thumbnail"
                :youtube-video-id="excerpt.youtubeVideoId"
        />
        <YoutubeThumbnail
                v-else-if="excerpt.thumbnail === OriginalThumbnail"
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

    OriginalThumbnail = YoutubeVideoExcerptDtoExternal.Original

}

</script>

<style lang="scss" scoped>
.thumbnail-preview {
}
</style>
