<template>
    <VideoPreview :excerpt="excerpt" class="loading-screen">
        <span class="duration">
            {{ excerpt === null ? '' : durationText }}
        </span>
        <div class="play-button">
            <img src="/icons/play.png"/>
        </div>
    </VideoPreview>
</template>

<script lang="ts">
import formatInterval from "@/ts/utils/format-interval";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
import VideoPreview from "@/vue/VideoPreview.vue";

@Component({
    components: {VideoPreview}
})
export default class VideoLoadingScreen extends Vue {
    @Prop({required: true})
    excerpt: YoutubeVideoExcerptDto

    @Prop({default: false})
    screenshotExtracted: boolean

    get durationText(): string {
        const duration = Math.round(this.excerpt.endSeconds - this.excerpt.startSeconds);
        return formatInterval(duration, duration >= 3600, false)
    }
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.loading-screen {
    position: absolute;
    font-family: BigNoodleTooOblique, sans-serif;
    font-size: 3em;
    min-height: 100%;

    &:hover .play-button {
        background-color: hsla(0, 0, 20%, .7);
    }

    .play-button {
        background-color: hsla(0, 0, 20%, .9);
        width: 1em;
        height: 1em;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border-radius: 50%;
        font-size: 1.2em;

        img {
            height: auto;
            width: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            padding-left: .08em;
        }
    }

    .duration {
        background-color: rgba($overwatch-panel-bg-color, .6);
        font-size: .8em;
        height: 1em;
        width: min-content;
        padding: .1em .4em .1em .26em;
        position: absolute;
        bottom: 50%;
    }

    video {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
