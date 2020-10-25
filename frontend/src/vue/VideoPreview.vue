<template>
    <div class="video-preview"
         v-bind:style="{
        'background-image': excerpt === null ? undefined : `url('${thumbnailUrl}')`
             }"
    >
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";

@Component({})
export default class VideoPreview extends Vue {
    @Prop({required: true})
    excerpt: YoutubeVideoExcerptDto

    get thumbnailUrl(): string {
        return `https://i3.ytimg.com/vi/${this.excerpt.youtubeVideoId}/mqdefault.jpg`
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
