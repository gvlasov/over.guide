<template>
    <div class="wrap">
        <div class="create-buttons">
            <button
                    class="create-new-part-button overwatch-main-button"
                    @click="createNewTextPart('beginning')"
            >+ text
            </button>
            <button
                    class="create-new-part-button overwatch-main-button"
                    @click="createNewVideoPart('beginning')"
            >+ video
            </button>
        </div>
        <draggable v-model="parts" draggable=".item" :disabled="isEditing()">
            <div v-for="(widget, index) in parts" :key="index" class="item">
                <div class="text-guide-part" v-if="widget.isText()">
                    <a
                            v-if="!widget.editing"
                            class="edit-button"
                            @click="widget.editing = true"
                    >Edit</a>
                    <a
                            v-if="widget.editing"
                            class="view-button"
                            @click="widget.editing = false"
                    >Save</a>
                    <div
                            v-if="!widget.editing"
                            class="text-guide-part-content"
                            v-html="widget.part.render()"
                    ></div>
                    <textarea
                            v-if="widget.editing"
                            class="guide-part-text-editor"
                            v-model="widget.part.text"
                            rows="10"
                    ></textarea>
                </div>
                <div v-if="widget.isVideo()">
                    <a
                            class="edit-button"
                            @click="widget.editing = true"
                            v-if="!widget.editing"
                    >Edit</a>
                    <a
                            class="view-button"
                            @click="widget.editing = false"
                            v-if="widget.editing"
                    >Save</a>
                    <div v-if="widget.editing" key="editor">
                        <YoutubeExcerptEditor
                                :video-id="widget.part.excerpt.youtubeVideoId"
                                :initial-start-seconds="widget.part.excerpt.startSeconds"
                                :initial-end-seconds="widget.part.excerpt.endSeconds"
                                :player-element-id="index + '-editor-' + widget.part.excerpt.youtubeVideoId"
                                @startSecondsChange="onStartSecondsChangeHacky(widget, $event)"
                                @endSecondsChange="onEndSecondsChangeHacky(widget, $event)"
                                class="video-editor"
                        />
                    </div>
                    <div v-if="!widget.editing" key="video">
                        <YoutubeVideo
                                :video-id="widget.part.excerpt.youtubeVideoId"
                                :start="widget.part.excerpt.startSeconds"
                                :end="widget.part.excerpt.endSeconds"
                                :loop="true"
                                :autoplay="true"
                                :mute="true"
                                :player-element-id="index +'-'+ widget.part.excerpt.youtubeVideoId"
                                class="video"
                                v-bind:style="'width: 20em; height: 12.2em'"
                        />
                    </div>
                </div>
            </div>
        </draggable>
        <div class="create-buttons">
            <button
                    class="create-new-part-button overwatch-main-button"
                    @click="createNewTextPart('end')"
            >+ text
            </button>
            <button
                    class="create-new-part-button overwatch-main-button"
                    @click="createNewVideoPart('end')"
            >+ video
            </button>
        </div>
    </div>
</template>

<script>
    import GuidePartText from '@/js/GuidePartText';
    import GuidePartVideo from '@/js/GuidePartVideo';
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import draggable from 'vuedraggable'
    import GuidePartWidget from "@/js/GuidePartWidget";
    import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";

    export default {
        model: {},
        props: {},
        methods: {
            createNewTextPart(where) {
                this.createNewPart(
                    where,
                    () => new GuidePartText('Pantenol')
                );
            },
            createNewVideoPart(where) {
                this.createNewPart(
                    where,
                    () =>
                        new GuidePartVideo(
                            {
                                youtubeVideoId: 'h2rpFJhBMcs',
                                startSeconds: 22.32,
                                endSeconds: 30,
                            }
                        )
                );
            },
            /**
             * @param {string} where 'beninning' or 'end'
             * @param {Function} how
             */
            createNewPart(where, how) {
                (
                    (where === 'beginning')
                        ? this.parts.unshift
                        : this.parts.push
                )
                    .apply(
                        this.parts,
                        [
                            new GuidePartWidget(
                                how(),
                                true
                            )
                        ]
                    );
            },
            /**
             * @return {boolean}
             */
            isEditing() {
                return this.parts.some(part => part.editing);
            },
            /**
             * @param {GuidePartWidget} widget
             * @param {number} newValue
             */
            onStartSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.startSeconds = newValue;
            },
            /**
             * @param {GuidePartWidget} widget
             * @param {number} newValue
             */
            onEndSecondsChangeHacky(widget, newValue) {
                widget.part.excerpt.endSeconds = newValue;
            },
        },
        data() {
            return {
                parts: [
                    new GuidePartWidget(
                        new GuidePartText('Pantelol')
                    ),
                    new GuidePartWidget(
                        new GuidePartVideo(
                            {
                                youtubeVideoId: 'qhtQx9ZXrf8',
                                startSeconds: 12.32,
                                endSeconds: 30.3,
                            }
                        )
                    ),
                    new GuidePartWidget(
                        new GuidePartText(
                            `### Pantenol\n![](https://i.imgur.com/Eug7rxn.png) )`
                        ),
                    ),
                ]
            }
        }
        ,
        components: {
            YoutubeExcerptEditor, YoutubeVideo, draggable
        }
        ,
    }
    ;

</script>

<style scoped>
    @import '~@/assets/css/fonts.css';
    @import '~@/assets/css/overwatch-ui.css';

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
    }

    .text-guide-part {
        max-width: 20em;
    }

    .text-guide-part-content {
        text-align: left;
        pointer-events: none;
    }

    .edit-button {

    }

    .guide-part-text-editor {
        width: 100%;
    }

    .text-guide-part-content >>> img {
        max-width: 100%;
    }

    .create-buttons {
        display: flex;
        justify-content: space-evenly;
    }

    .create-new-part-button {
        font-size: 2em;
        padding: .3em;
        line-height: 1em;
    }

    .video {
        display: block;
    }

    .video-editor {
        display: block;
    }

</style>
