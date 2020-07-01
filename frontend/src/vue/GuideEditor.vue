<template>
    <div class="wrap">
        <button
                class="create-new-part"
                @click="createNewPart"
        ></button>
        <draggable v-model="parts" draggable=".item">
            <div v-for="part in parts" :key="part.id()" class="item">
                <div v-if="isTextPart(part)">{{ part.text }}
                </div>
                <div v-if="isVideoPart(part)">
                    <YoutubeVideo
                            :video-id="part.excerpt.videoId"
                            :start="part.excerpt.startSeconds"
                            :end="part.excerpt.endSeconds"
                            :loop="true"
                            :autoplay="true"
                            :width="300"
                            style="pointer-events: none;"
                    />
                </div>
            </div>
        </draggable>
        <div class="parts" v-for="part in parts">

        </div>
    </div>
</template>

<script>
    import GuidePartText from '../js/GuidePartText';
    import GuidePartVideo from '../js/GuidePartVideo';
    import YoutubeVideo from "./YoutubeVideo.vue";
    import draggable from 'vuedraggable'

    export default {
        model: {},
        props: {},
        methods: {
            createNewPart() {

            },
            isTextPart(part) {
                return part instanceof GuidePartText;
            },
            isVideoPart(part) {
                return part instanceof GuidePartVideo;
            },
        },
        data() {
            return {
                parts: [
                    new GuidePartText('You penis girl'),
                    new GuidePartText('I like you lets fuck'),
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
</style>
