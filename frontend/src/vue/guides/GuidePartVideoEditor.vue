<template>
    <div>
        <div v-if="widget.editing" key="editor">
            <YoutubeExcerptEditor
                    :video-id="widget.part.excerpt.youtubeVideoId"
                    :initial-start-seconds="widget.part.excerpt.startSeconds"
                    :initial-end-seconds="widget.part.excerpt.endSeconds"
                    :player-element-id="index + '-editor-' + widget.part.excerpt.youtubeVideoId"
                    @startSecondsChange="onStartSecondsChangeHacky(widget, $event)"
                    @endSecondsChange="onEndSecondsChangeHacky(widget, $event)"
                    class="video-editor"
                    :video-css-width="'100%'"
                    :video-css-height="'22rem'"
            />
        </div>
        <div v-if="!widget.editing" key="video">
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
            onStartSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.startSeconds = newValue;
            },
            onEndSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.endSeconds = newValue;
            },
        },
        data() {
            return {}
        },
        components: {
            YoutubeExcerptEditor,
            YoutubeVideo,
        },
    };

</script>

<style lang="scss" scoped>
    .video {
        max-width: 100%;
        width: 100%;
    }

    .video-editor {
        display: block;
    }
</style>
