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
        <div v-else-if="widget.editing" key="editor">
            <YoutubeExcerptEditor
                    :video-id="widget.part.excerpt.youtubeVideoId"
                    :initial-start-seconds="widget.part.excerpt.startSeconds"
                    :initial-end-seconds="widget.part.excerpt.endSeconds"
                    :player-element-id="'video-editor-' + widget.part.excerpt.youtubeVideoId + '-' + index"
                    @startSecondsChange="onStartSecondsChangeHacky(widget, $event)"
                    @endSecondsChange="onEndSecondsChangeHacky(widget, $event)"
                    class="video-editor"
            />
        </div>
        <div v-else-if="!widget.editing" key="video">
            <AspectRatioBox>
                <YoutubeVideo
                        :video-id="widget.part.excerpt.youtubeVideoId"
                        :start="widget.part.excerpt.startSeconds"
                        :end="widget.part.excerpt.endSeconds"
                        :loop="true"
                        :autoplay="false"
                        :mute="true"
                        :player-element-id="index +'-'+ widget.part.excerpt.youtubeVideoId"
                        class="video"
                />
            </AspectRatioBox>
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import YoutubeUrlVso from "@/ts/vso/YoutubeUrlVso";
import EmbeddableCache from "@/ts/EmbeddableCache";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, Watch} from "vue-property-decorator";
import AsyncComputedProp from 'vue-async-computed-decorator'
import AspectRatioBox from "@/vue/AspectRatioBox.vue";

@Component({
    components: {
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
        this.$emit('videoSelection', youtubeUrl.videoId)
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

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
        @include overwatch-futura;
        color: black;
        font-size: 1.2em;
        text-align: center;

        &:focus::-webkit-input-placeholder {
            color: transparent;
        }
    }

    .youtube-video-link-errors {
        @include overwatch-futura;
        text-shadow: 0 0 .18em #ff6600;
        font-size: 1.3em;
    }
}

.video {
    max-width: 100%;
    width: 100%;
}

.video-editor {
    display: block;
}

</style>
