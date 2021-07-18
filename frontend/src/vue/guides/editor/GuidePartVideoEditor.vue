<template>
    <div class="guide-part-video-editor">
        <div v-if="widget.editing" key="editor" class="video-part-editor">
            <template v-if="editingThumbnail">
                <YoutubeThumbnail
                        v-if="widget.part.excerpt.thumbnail === ThumbnailOriginal"
                        :video-id="widget.part.excerpt.youtubeVideoId"
                />
                <img
                        v-else-if="widget.part.excerpt.thumbnail === ThumbnailImage"
                        src=""
                />
                <MomentThumbnailEditor
                        v-show="widget.part.excerpt.thumbnail >= 0"
                        :excerpt="widget.part.excerpt"
                />
            </template>
            <YoutubeExcerptEditor
                    v-else
                    :video-id="widget.part.excerpt.youtubeVideoId"
                    :initial-start-seconds="widget.part.excerpt.startSeconds"
                    :initial-end-seconds="widget.part.excerpt.endSeconds"
                    :player-element-id="'video-editor-' + widget.part.excerpt.youtubeVideoId + '-' + index"
                    :entry="entry"
                    @startSecondsChange="onStartSecondsChangeHacky(widget, $event)"
                    @endSecondsChange="onEndSecondsChangeHacky(widget, $event)"
                    class="video-editor"
                    @playerReady="(p) => player = p"
            />
            <ThumbnailMethodSelector
                    v-if="player !== null"
                    @select-moment-auto="setAutoThumbnail"
                    @select-moment-custom="setMomentThumbnail"
                    @select-original="setOriginalThumbnail"
                    :disable-moment="editingThumbnail && widget.part.excerpt.thumbnail >= 0"
            />
            <div class="thumbnail-preview-wrap">
                <ThumbnailPreview :excerpt="widget.part.excerpt"/>
            </div>
            <OverwatchPanelButton
                    v-if="editingThumbnail"
                    type="main"
                    v-hammer:tap="() => editingThumbnail = false"
            >Done
            </OverwatchPanelButton>
        </div>
        <div v-else-if="!widget.editing" key="video">
            <GuideVideo
                    :index="0"
                    :part="widget.part"
                    :initial-show-preload="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import YoutubeExcerptEditor from "@/vue/guides/editor/YoutubeExcerptEditor";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop} from "vue-property-decorator";
import AspectRatioBox from "@/vue/AspectRatioBox.vue";
import ThumbnailMethodSelector
    from "@/vue/guides/editor/ThumbnailMethodSelector.vue";
import MomentThumbnailEditor
    from "@/vue/guides/editor/MomentThumbnailEditor.vue";
import {YoutubeVideoExcerptDtoExternal} from "data/dto/YoutubeVideoExcerptDto";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import VideoFrameViewer from "@/vue/videos/VideoFrameViewer.vue";
import ThumbnailPreview from "@/vue/guides/editor/ThumbnailPreview.vue";
import YoutubeThumbnail from "@/vue/videos/YoutubeThumbnail.vue";
import GuideVideo from "@/vue/guides/GuideVideo.vue";
import Player = YT.Player;
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";

@Component({
    components: {
        GuideVideo,
        YoutubeThumbnail,
        ThumbnailPreview,
        VideoFrameViewer,
        OverwatchPanelButton,
        MomentThumbnailEditor,
        ThumbnailMethodSelector,
        AspectRatioBox,
        YoutubeExcerptEditor,
        YoutubeVideo,
    },
})
export default class GuidePartVideoEditor extends Vue {
    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso|NewGuideHistoryEntryVso

    @Prop({required: true})
    widget: GuidePartVideoWidget

    @Prop({required: true})
    index: number

    ThumbnailOriginal = YoutubeVideoExcerptDtoExternal.Original

    ThumbnailImage = YoutubeVideoExcerptDtoExternal.Image

    player: Player | null = null

    editingThumbnail: boolean = false

    onStartSecondsChangeHacky(widget: GuidePartVideoWidget, newValue) {
        widget.part.excerpt.startSeconds = newValue
    }

    onEndSecondsChangeHacky(widget: GuidePartVideoWidget, newValue) {
        widget.part.excerpt.endSeconds = newValue
    }

    setAutoThumbnail() {
        this.widget.part.excerpt.thumbnail =
            this.widget.part.excerpt.startSeconds +
            (this.widget.part.excerpt.endSeconds - this.widget.part.excerpt.startSeconds) / 2
    }

    setMomentThumbnail() {
        if (this.player === null) {
            throw new Error()
        }
        if (this.widget.part.excerpt.thumbnail !== null && this.widget.part.excerpt.thumbnail < 0) {
            this.widget.part.excerpt.thumbnail = this.player.getCurrentTime()
        }
        this.editingThumbnail = true
    }

    setOriginalThumbnail() {
        this.widget.part.excerpt.thumbnail = YoutubeVideoExcerptDtoExternal.Original
        this.editingThumbnail = false
    }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.guide-part-video-editor {
    .video-part-editor {
        display: flex;
        flex-wrap: wrap;
        gap: .7em;

        .thumbnail-method-selector {
            flex-grow: 1;
        }

        .youtube-thumbnail {
            display: block;
            width: 100%;
            height: auto;
        }

        .moment-thumbnail-editor {
            flex-basis: 100%;
        }

        .thumbnail-preview-wrap {
            flex-basis: 0;
            flex-grow: 0;
            position: relative;
            .thumbnail-preview {
                position: absolute;
                right: 0;
                height: 100%;
            }
        }

        .video-editor {
            display: block;
            flex-basis: 100%;
            max-width: 100%;
        }
    }

    .guide-video {
        max-width: 100%;
        width: 100%;
    }
}

</style>
