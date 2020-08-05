<template>
    <div class="wrap">
        <Tag
                :guide-hero-tag="guide.descriptor"
        />
        <div v-for="(part, index) in guide.parts" :key="index" class="guide-part">
            <div class="text-guide-part" v-if="part.part.kind === 'text'">
                <div
                        class="text-guide-part-content"
                        v-html="part.render()"
                ></div>
            </div>
            <div v-if="part.part.kind === 'video'">
                <YoutubeVideo
                        :video-id="part.excerpt.youtubeVideoId"
                        :start="part.excerpt.startSeconds"
                        :end="part.excerpt.endSeconds"
                        :loop="true"
                        :autoplay="true"
                        :mute="true"
                        :player-element-id="index +'-'+ part.excerpt.youtubeVideoId"
                        class="video"
                        v-bind:style="{width: '100%', height: '22rem'}"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import OverwatchButton from "@/vue/OverwatchButton";
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
    import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
    import GuideVso from "@/js/vso/GuideVso";
    import Tag from "@/vue/guides/tags/hero/Tag";

    const backend = new Backend(axios);

    export default {
        model: {},
        props: {
            guide: {
                type: GuideVso,
                required: true
            }
        },
        methods: {
            renderTextPart(part) {
                return new GuidePartTextWidget(part).render()
            },
        },
        data() {
            return {}
        },
        components: {
            Tag,
            DescriptorBuilder,
            OverwatchButton,
            YoutubeVideo,
        },
    };

</script>

<style scoped>
    @import '~@/assets/css/fonts.css';

    .wrap {
        display: inline-block;
        max-width: 40em;
    }

    .guide-part {
        padding: 1em;
        margin: .3em;
        cursor: pointer;
        background-color: rgba(43, 55, 83, 0.8);
        color: white;
        font-family: 'Futura Demi Bold', 'sans-serif';
        position: relative;
    }

    .text-guide-part {
        max-width: 100%;
    }

    .text-guide-part ::v-deep img {
        max-width: 100%;
    }

    .text-guide-part-content {
        text-align: left;
        pointer-events: none;
        font-size: 1.5em;
        word-break: break-word;
    }

    .guide-part-buttons > * {
        font-size: 2em;
    }

    textarea.guide-part-text-editor {
        width: 100%;
        max-width: 20em;
        font-size: 1em;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    }

    .create-buttons {
        display: flex;
        justify-content: space-evenly;
        z-index: 1;
        font-size: .8rem;
    }

    .video {
        max-width: 100%;
        width: 100%;
    }

    .video-editor {
        display: block;
    }

    .descriptor-builder {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        /* For it to be positioned above everything else,
               which is important when the dropdown is displayed
               */
    }

    .guide-part > .guide-part-buttons {

    }

    .guide-part:hover > .guide-part-buttons {
    }

</style>
