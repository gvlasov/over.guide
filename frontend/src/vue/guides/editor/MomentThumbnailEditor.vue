<template>
    <div class="moment-thumbnail-editor">
        <AspectRatioBox>
            <YoutubeVideo
                    :video-id="excerpt.youtubeVideoId"
                    :start="initialThumbnailSeconds"
                    :end="null"
                    :loop="false"
                    :autoplay="false"
                    :custom-player-element-id="playerElementId"
                    @playerReady="onPlayerReady"
                    @play="() => videoDurationSeconds = player.getDuration()"
                    @pause="() => {excerpt.thumbnail = player.getCurrentTime(); $forceUpdate();}"
                    @skip="() => void 0"
                    class="video"
            />
        </AspectRatioBox>
        <div class="toolbar">
            <GuideVideoExcerptTimebar
                    v-if="player !== null"
                    :current-seconds="excerpt.thumbnail"
                    :duration-seconds="videoDurationSeconds"
                    @input="onPositionSelect"
            />
            <PreciseTimeInput
                    v-if="player !== null"
                    :total-value-seconds="excerpt.thumbnail"
                    @totalValueSecondsChange="onPositionSelect"
                    :show-hours="videoDurationSeconds >= 3600"
                    :min-seconds="0"
                    :max-seconds="videoDurationSeconds"
            />
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import PreciseTimeInput from "@/vue/videos/PreciseTimeInput.vue";
import AspectRatioBox from "@/vue/AspectRatioBox";
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import GuideVideoExcerptTimebar
    from "@/vue/guides/GuideVideoExcerptTimebar.vue";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
import Player = YT.Player;

@Component({
    components: {
        GuideVideoExcerptTimebar,
        AspectRatioBox,
        PreciseTimeInput,
        YoutubeVideo,
    }
})
export default class MomentThumbnailEditor extends Vue {
    @Prop({required: true})
    excerpt: YoutubeVideoExcerptDto

    initialThumbnailSeconds: number | null =
        this.excerpt.thumbnail >= 0
            ? new Number(this.excerpt.thumbnail).valueOf()
            : this.excerpt.startSeconds

    @Prop({default: ''})
    playerElementId: string

    player: Player | null = null

    videoDurationSeconds: number | null = null

    onTimeUpdated(seconds: number) {
        this.excerpt.thumbnail = seconds
        this.$forceUpdate()
    }

    @Watch('excerpt', {deep: true})
    onThumbChange() {
    }

    onPositionSelect(seconds: number) {
        if (this.player === null) {
            throw new Error()
        }
        this.excerpt.thumbnail = seconds
        this.$forceUpdate()
        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.player.pauseVideo()
        }
        console.log(this.excerpt)
        this.player.seekTo(seconds, true)
    }

    onPlayerReady(p: Player) {
        this.videoDurationSeconds = p.getDuration();
        this.player = p
    }

}

</script>

<style lang="scss" scoped>
.moment-thumbnail-editor {
    .toolbar {
        padding: .5em 0 1.7em 0;
        display: flex;
        gap: .5em;

        .excerpt-timebar {
            display: block;
            flex-shrink: 1;
            flex-grow: 1;
        }
    }
}
</style>
