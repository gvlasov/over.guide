<template>
    <div class="loading-screen"
         v-bind:style="{
        'background-image': excerpt === null ? undefined : `url('${thumbnailUrl}')`
             }"
    >
        <span class="duration">
            {{ excerpt === null ? '' : durationText }}
        </span>
        <div class="play-button">
            <img src="/icons/play.png"/>
        </div>
    </div>
</template>

<script lang="ts">
import formatInterval from "@/ts/utils/format-interval";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto";

@Component({})
export default class VideoLoadingScreen extends Vue {
    @Prop({required: true})
    excerpt: YoutubeVideoExcerpsDto

    get thumbnailUrl(): string {
        return `https://i3.ytimg.com/vi/${this.excerpt.youtubeVideoId}/mqdefault.jpg`
    }

    get durationText(): string {
        const duration = Math.round(this.excerpt.endSeconds - this.excerpt.startSeconds);
        return formatInterval(duration, duration >= 3600, false)
    }
};

</script>

<style lang="scss" scoped>
.loading-screen {
    position: absolute;
    font-family: BigNoodleTooOblique, sans-serif;
    font-size: 3em;
    min-height: 100%;
    background-color: #111;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;

    &:hover .play-button {
        background-color: hsla(0, 0, 20%, .7);
    }

    .play-button {
        background-color: hsla(0, 0, 20%, .9);
        width: 1.5em;
        height: 1.5em;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border-radius: 50%;

        img {
            height: auto;
            width: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            padding-left: .15em;
        }
    }

    .duration {
        background-color: black;
        height: 1em;
        width: min-content;
        padding: 0 .4em;
        position: absolute;
        bottom: 50%;
    }
}
</style>
