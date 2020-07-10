<template>
    <div class="wrap">
        <button
                class="create-new-part"
                @click="createNewTextPart"
        >Add new text
        </button>
        <button
                class="create-new-part"
                @click="createNewVideoPart"
        >Add new video
        </button>
        <draggable v-model="parts" draggable=".item">
            <div v-for="(part, index) in parts" :key="index + '_' + part.id()" class="item">
                <div class="text-guide-part" v-if="isTextPart(part)" v-html="renderTextPart(part)"></div>
                <div v-if="isVideoPart(part)">
                    <YoutubeVideo
                            :video-id="part.excerpt.youtubeVideoId"
                            :start="part.excerpt.startSeconds"
                            :end="part.excerpt.endSeconds"
                            :loop="true"
                            :autoplay="true"
                            :width="300"
                            :player-element-id="index + part.excerpt.youtubeVideoId"
                            style="pointer-events: none;"
                    />
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
    import GuidePartText from '../js/GuidePartText';
    import GuidePartVideo from '../js/GuidePartVideo';
    import YoutubeVideo from "./YoutubeVideo.vue";
    import draggable from 'vuedraggable'
    import marked from 'marked'

    export default {
        model: {},
        props: {},
        methods: {
            createNewTextPart() {
                const part = new GuidePartText('Pantenol');
                this.parts.push(part);
                this.editTextPart(part)
            },
            createNewVideoPart() {
                const part = new GuidePartVideo(
                    {
                        youtubeVideoId: 'h2rpFJhBMcs',
                        startSeconds: 22.32,
                        endSeconds: 32.3,
                    }
                );
                this.parts.push(part);
            },
            /**
             * @param {GuidePartText} part
             */
            renderTextPart(part) {
                return marked(part.text);
            },
            isTextPart(part) {
                return part instanceof GuidePartText;
            },
            isVideoPart(part) {
                return part instanceof GuidePartVideo;
            },
            /**
             * @param {GuidePartText} part
             */
            editTextPart(part) {

            }
        },
        data() {
            return {
                parts: [
                    new GuidePartText(`### Pantenol\nPantenol fucks! )`),
                    new GuidePartText('Pantelol'),
                    new GuidePartVideo(
                        {
                            youtubeVideoId: 'qhtQx9ZXrf8',
                            startSeconds: 12.32,
                            endSeconds: 865.3,
                        }
                    ),
                ]
            }
        },
        components: {YoutubeVideo, draggable},
    };

</script>

<style scoped>
    .wrap {
        min-width: 20em;
        display: inline-block;
    }

    .item {
        padding: 1em;
        margin: .3em;
        border-radius: 1em;
        border: 1px solid hsl(33, 100%, 88%);
        cursor: pointer;
        pointer-events: initial;
    }

    .text-guide-part {
        text-align: left;
    }
</style>
