<template>
    <div class="guide-part-video-editor">
        <div
                v-if="widget.part.excerpt.youtubeVideoId === ''"
                class="youtube-video-link-form"
        >
            <input
                    type="text"
                    class="youtube-video-link-input"
                    v-model="youtubeVideoUrl"
                    placeholder="Put here a link to a Youtube video"
            />
            <div class="youtube-video-link-errors">
                <template v-if="$asyncComputed.validations.success">
                    <template v-if="youtubeVideoUrl === ''"></template>
                    <div v-else-if="!validations.isUrl">This is not a valid URL</div>
                    <div v-else-if="!validations.isValidYoutubeVideoUrl">This is not a valid Youtube video URL</div>
                    <div v-else-if="!validations.isEmbeddingAllowed">Video owner prohibited embedding of this video</div>
                    <div v-else-if="!validations.videoExists">This video doesn't exist</div>
                </template>
            </div>
        </div>
        <div v-else-if="widget.editing" key="editor" class="video-part-editor">
            <template
                    v-if="editingThumbnail"
            >
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
            <ThumbnailPreview :excerpt="widget.part.excerpt"/>
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
import YoutubeUrlVso from "@/ts/vso/YoutubeUrlVso";
import EmbeddableCache from "@/ts/EmbeddableCache";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, Watch} from "vue-property-decorator";
import AsyncComputedProp from 'vue-async-computed-decorator'
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
import Player = YT.Player;
import GuideVideo from "@/vue/guides/GuideVideo.vue";

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
    widget: GuidePartVideoWidget

    @Prop({required: true})
    index: number

    youtubeVideoUrl: string = ''

    ThumbnailOriginal = YoutubeVideoExcerptDtoExternal.Original

    ThumbnailImage = YoutubeVideoExcerptDtoExternal.Image

    player: Player | null = null

    editingThumbnail: boolean = false

    mounted() {
        console.log(this.widget.part.excerpt)
    }

    @AsyncComputedProp()
    validations() {
        return this.validate(this.youtubeVideoUrl)
    }

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
        if (this.widget.part.excerpt.thumbnail !== null && this.widget.part.excerpt.thumbnail < 0)  {
            this.widget.part.excerpt.thumbnail = this.player.getCurrentTime()
        }
        this.editingThumbnail = true
    }

    setOriginalThumbnail() {
        this.widget.part.excerpt.thumbnail = YoutubeVideoExcerptDtoExternal.Original
        this.editingThumbnail = false
    }

    async validate(inputText) {
        const validations = {
            isUrl: false,
            isValidYoutubeVideoUrl: false,
            isEmbeddingAllowed: false,
            videoExists: false,
        };
        let url;
        try {
            url = new URL(inputText)
            validations.isUrl = true
        } catch (e) {
            return validations;
        }
        let youtubeUrl: YoutubeUrlVso;
        try {
            youtubeUrl = new YoutubeUrlVso(url)
            validations.isValidYoutubeVideoUrl = true
        } catch (e) {
            return validations
        }
        /*
        "Embedding allowed" is checked before "Video exists" because
        embedding can be cached and checking if video exists is expensive
         */
        if (EmbeddableCache.isEmbeddable(youtubeUrl.videoId)) {
            validations.isEmbeddingAllowed = true
        } else {
            return validations;
        }
        const videoInfo = await youtubeUrl.apiJson();
        if (videoInfo.pageInfo.totalResults > 0) {
            validations.videoExists = true;
        } else {
            return validations;
        }
        return validations;
    }


    @Watch('youtubeVideoUrl')
    async onYoutubeVideoUrlChange(newValue) {
        const validations = await this.validate(newValue);
        for (let validation in validations) {
            if (!validations[validation]) {
                return false;
            }
        }
        const youtubeUrl = new YoutubeUrlVso(new URL(this.youtubeVideoUrl));
        this.$emit('videoSelection', youtubeUrl)
    }

    onPlayerReady(player: Player) {
        this.player = player
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.guide-part-video-editor {
    .youtube-video-link-form {
        margin-bottom: 2em;

        .youtube-video-link-input {
            outline: 0;
            display: inline-block;
            margin: 0 auto 0 auto;
            height: 3em;
            padding: .1em;
            max-width: 100%;
            width: 30em;
            box-sizing: border-box;
            font-family: 'IBM Plex Sans', 'sans-serif';
            font-weight: bold;
            color: black;
            font-size: 1.2em;
            text-align: center;

            &:focus {
                text-decoration: underline;

                &::-webkit-input-placeholder {
                    visibility: hidden;
                }
            }
        }

        .youtube-video-link-errors {
            @include overwatch-futura;
            text-shadow: 0 0 .18em #ff6600;
            font-size: 1.3em;
        }

    }

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

        .thumbnail-preview {
            display: block;
            user-select: none;
            pointer-events: none;
            justify-items: center;
            position: relative;

            & ::v-deep > * {
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
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
