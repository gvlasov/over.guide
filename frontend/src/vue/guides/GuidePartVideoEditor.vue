<template>
    <div>
        <div v-if="widget.part.excerpt === null">
            <input
                    type="text"
                    class="youtube-video-link-input"
                    @input="onVideoLinkInputChange"
                    placeholder="Put here a link to a Youtube video"
            />
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
                    :video-css-width="'100%'"
                    :video-css-height="'22rem'"
            />
        </div>
        <div v-else-if="!widget.editing" key="video">
            <YoutubeVideo
                    :video-id="widget.part.excerpt.youtubeVideoId"
                    :start="widget.part.excerpt.startSeconds"
                    :end="widget.part.excerpt.endSeconds"
                    :loop="true"
                    :autoplay="false"
                    :mute="true"
                    :player-element-id="index +'-'+ widget.part.excerpt.youtubeVideoId"
                    class="video"
                    v-bind:style="{width: '100%', height: '22rem'}"
            />
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";
    import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
    import YoutubeUrlVso from "@/js/vso/YoutubeUrlVso";
    import {parse, toSeconds} from 'iso8601-duration';

    export default {
        model: {},
        props: {
            widget: {
                type: GuidePartVideoWidget,
                required: true,
            },
            index: {
                type: Number,
                required: true,
            }
        },
        methods: {
            onVideoLinkInputChange(event) {
                const inputText = event.target.value;
                let url;
                try {
                    url = new URL(inputText)
                } catch (e) {
                    return;
                }
                const youtubeUrl = new YoutubeUrlVso(url)
                youtubeUrl
                    .contentDetails()
                    .then(
                        contentDetails => {
                            this.$emit(
                                'videoSelection',
                                {
                                    youtubeVideoId: youtubeUrl.videoId,
                                    startSeconds: 0,
                                    endSeconds: toSeconds(parse(contentDetails.items[0].contentDetails.duration)),
                                }
                            )
                        }
                    )
            },
            onStartSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.startSeconds = newValue;
            },
            onEndSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.endSeconds = newValue;
            },
        },
        data() {
            return {
                youtubeVideoUrl: null,
            }
        },
        components: {
            YoutubeExcerptEditor,
            YoutubeVideo,
        },
    };

</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";

    .video {
        max-width: 100%;
        width: 100%;
    }

    .video-editor {
        display: block;
    }

    .youtube-video-link-input {
        display: inline-block;
        margin: 0 auto 2em auto;
        height: 3em;
        padding: .1em;
        max-width: 100%;
        width: 30em;
        box-sizing: border-box;
        @include overwatch-futura;
        font-size: 1.2em;
        text-align: center;

        &:focus::-webkit-input-placeholder {
            color: transparent;
        }
    }
</style>
