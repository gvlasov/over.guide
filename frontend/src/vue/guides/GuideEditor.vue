<template>
    <div class="wrap">
        <DescriptorBuilder
                :descriptor="guide.descriptor"
                :search-button-enabled="false"
                class="descriptor-builder"
        />
        <div class="create-buttons">
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewTextPart('beginning')"
            >+ text
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    :disabled="guide.parts.length === 0"
                    v-hammer:tap="saveGuide"
            >Done
            </OverwatchButton>
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewVideoPart('beginning')"
            >+ video
            </OverwatchButton>
        </div>
        <draggable v-model="guide.parts" draggable=".guide-part" :disabled="isEditing()">
            <div v-for="(widget, index) in guide.parts" :key="index" class="guide-part">
                <GuidePartTextEditor
                        v-if="widget.isText()"
                        :widget="widget"
                />
                <div v-if="widget.isVideo()">
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
                <div class="guide-part-buttons">
                    <OverwatchButton
                            v-if="!widget.editing"
                            type="default"
                            class="edit-button"
                            v-hammer:tap="() => widget.editing = true"
                    >Edit
                    </OverwatchButton>
                    <OverwatchButton
                            v-if="widget.editing"
                            type="default"
                            class="view-button"
                            v-hammer:tap="() => widget.editing = false"
                    >Save
                    </OverwatchButton>
                    <OverwatchButton
                            type="default"
                            class=""
                            v-hammer:tap="() => deletePart(index)"
                    >Delete
                    </OverwatchButton>
                </div>
            </div>
        </draggable>
        <div class="create-buttons"
             v-if="guide.parts.length > 0"
        >
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewTextPart('end')"
            >+ text
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    v-hammer:tap="saveGuide"
            >Done
            </OverwatchButton>
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewVideoPart('end')"
            >+ video
            </OverwatchButton>
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import draggable from 'vuedraggable'
    import GuidePartWidget from "@/js/vso/GuidePartWidget";
    import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";
    import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
    import OverwatchButton from "@/vue/OverwatchButton";
    import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
    import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import GuideTheme from "data/GuideTheme";
    import MapId from "data/MapId";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import HeroId from "data/HeroId";
    import GuidePartTextEditor from "@/vue/guides/GuidePartTextEditor";

    const backend = new Backend(axios);

    export default {
        model: {},
        props: {},
        methods: {
            async saveGuide() {
                const guideId = await backend.saveGuide({
                    guideId: this.guide.guideId,
                    descriptor: {
                        playerHeroes:
                            this.guide.descriptor.playerHeroes.map(hero => hero.id),
                        allyHeroes:
                            this.guide.descriptor.allyHeroes.map(hero => hero.id),
                        enemyHeroes:
                            this.guide.descriptor.enemyHeroes.map(hero => hero.id),
                        mapTags: this.guide.descriptor.mapTags,
                        thematicTags: this.guide.descriptor.thematicTags,
                    },
                    parts: this.guide.parts.map(widget => widget.part)
                })
                if (guideId !== null) {
                    this.guide.guideId = guideId
                }
            },
            createNewTextPart(where) {
                this.createNewPart(
                    where,
                    () => new GuidePartTextWidget(
                        {
                            kind: 'text',
                            contentMd: 'New part'
                        },
                        true
                    )
                );
            },
            deletePart(index) {
                this.guide.parts.splice(index, 1);
            },
            createNewVideoPart(where) {
                this.createNewPart(
                    where,
                    () =>
                        new GuidePartVideoWidget(
                            {
                                kind: 'video',
                                excerpt:
                                    {
                                        youtubeVideoId: 'h2rpFJhBMcs',
                                        startSeconds: 22.32,
                                        endSeconds: 30,
                                    }
                            },
                            true
                        )
                );
            },
            /**
             * @param {string} where 'beninning' or 'end'
             * @callback how
             */
            createNewPart(where, how) {
                (
                    (where === 'beginning')
                        ? this.guide.parts.unshift
                        : this.guide.parts.push
                )
                    .apply(this.guide.parts, [how()]);
            },
            /**
             * @return {boolean}
             */
            isEditing() {
                return this.guide.parts.some(part => part.editing);
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
                guide: {
                    id: undefined,
                    guideId: undefined,
                    descriptor: new GuideDescriptorVso({
                        playerHeroes: [HeroId.Pharah],
                        playerAbilities: [],
                        allyHeroes: [HeroId.Soldier],
                        allyAbilities: [],
                        enemyHeroes: [HeroId.Mei],
                        enemyAbilities: [],
                        thematicTags: [GuideTheme.Aim],
                        mapTags: [MapId.Havana],
                    }),
                    parts: [
                        new GuidePartTextWidget(
                            {kind: 'text', contentMd: 'Pantelol'},
                            true
                        ),
                        new GuidePartVideoWidget(
                            {
                                kind: 'video',
                                excerpt: {
                                    youtubeVideoId: 'qhtQx9ZXrf8',
                                    startSeconds: 12.32,
                                    endSeconds: 30.3,
                                }
                            }
                        ),
                        new GuidePartTextWidget(
                            {
                                kind: 'text',
                                contentMd: `### Pantenol\n![](https://i.imgur.com/Eug7rxn.png) )`,
                            }
                        ),
                    ]
                },
            }
        },
        components: {
            OverwatchButton,
            DescriptorBuilder,
            YoutubeExcerptEditor,
            YoutubeVideo,
            draggable,
            GuidePartTextEditor,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.css';

    .wrap {
        display: inline-block;
        max-width: 40em;

        .guide-part {
            padding: 1em;
            margin: .3em;
            cursor: pointer;
            background-color: rgba(43, 55, 83, 0.8);
            color: white;
            font-family: 'Futura Demi Bold', 'sans-serif';
            position: relative;
        }

        .guide-part-buttons > * {
            font-size: 2em;
        }

        .create-buttons {
            display: flex;
            justify-content: space-evenly;
            z-index: 1;

            & > * {
                font-size: 2rem;
                flex-shrink: 1;
                flex-basis: 5em;
            }

            & > * ::v-deep .content {
                padding-left: 0;
                padding-right: 0;
            }
        }

        .video {
            max-width: 100%;
            width: 100%;
        }

        .video-editor {
            display: block;
        }

        .descriptor-builder {
            z-index: 3;
            position: relative;
            width: 100%;
            margin-bottom: 1rem;
            /* For it to be positioned above everything else,
                   which is important when the dropdown is displayed
                   */
        }

        .create-new-part-button {
            white-space: nowrap;
        }
    }

</style>
