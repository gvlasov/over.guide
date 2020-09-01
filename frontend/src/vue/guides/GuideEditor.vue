<template>
    <div class="wrap root-content-sizer">
        <ParameterDescriptorSynchronizer
                v-model="guide.descriptor"
                base-path="/guide-editor/"
        />
        <div class="root-content-panel-wrap">
            <DescriptorBuilder
                    :descriptor="guide.descriptor"
                    :search-button-enabled="false"
                    class="descriptor-builder"
                    @descriptorChange="(newDescriptor) => {guide.descriptor = newDescriptor}"
            />
        </div>
        <div class="create-buttons">
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewTextPart('beginning')"
                    data-type="text"
            >+ text
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    :disabled="!isDoneButtonEnabled"
                    v-hammer:tap="saveGuide"
            >Done
            </OverwatchButton>
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    data-type="video"
                    v-hammer:tap="() => createNewVideoPart('beginning')"
            >+ video
            </OverwatchButton>
        </div>
        <draggable class="guide-parts root-content-panel-wrap" v-model="guide.parts" draggable=".guide-part" :disabled="isEditing()">
            <div v-for="(widget, index) in guide.parts" :key="index" class="guide-part">
                <GuidePartTextEditor
                        v-if="widget.isText()"
                        :widget="widget"
                />
                <GuidePartVideoEditor
                        v-if="widget.isVideo()"
                        :widget="widget"
                        :index="index"
                        @videoSelection="(videoId) => {widget.part.excerpt = {youtubeVideoId: videoId, startSeconds: 0, endSeconds: null}}"
                />
                <div class="guide-part-buttons">
                    <OverwatchButton
                            v-if="!widget.editing"
                            type="default"
                            class="edit-button"
                            v-hammer:tap="() => widget.editing = true"
                    >Edit
                    </OverwatchButton>
                    <OverwatchButton
                            v-if="widget.editing && widget.hasContent"
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
                    data-type="text"
                    :disabled="!isDoneButtonEnabled"
            >Done
            </OverwatchButton>
            <OverwatchButton
                    :type="'default'"
                    class="create-new-part-button"
                    v-hammer:tap="() => createNewVideoPart('end')"
                    data-type="video"
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
import GuidePartTextEditor from "@/vue/guides/GuidePartTextEditor";
import GuidePartVideoEditor from "@/vue/guides/GuidePartVideoEditor";
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import ParamsDescriptor from "@/js/ParamsDescriptor";

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
                            this.guide.descriptor.players.heroes.map(hero => hero.id),
                        teammateHeroes:
                            this.guide.descriptor.teammates.heroes.map(hero => hero.id),
                        enemyHeroes:
                            this.guide.descriptor.enemies.heroes.map(hero => hero.id),
                        playerAbilities:
                            this.guide.descriptor.players.abilities.map(ability => ability.id),
                        teammateAbilities:
                            this.guide.descriptor.teammates.abilities.map(ability => ability.id),
                        enemyAbilities:
                            this.guide.descriptor.enemies.abilities.map(ability => ability.id),
                        mapTags: this.guide.descriptor.maps.map(vso => vso.id),
                        thematicTags: this.guide.descriptor.thematicTags.map(vso => vso.id),
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
                            contentMd: ''
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
                                excerpt: null,
                            },
                            true
                        )
                );
            },
            /**
             * @param {string} where 'beginning' or 'end'
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
                  descriptor: new ParamsDescriptor(this.$route.params.descriptor).compute(),
                  parts: [
                    new GuidePartVideoWidget({
                      excerpt: {
                        youtubeVideoId: 'Ev373c7wSRg',
                        startSeconds: 0,
                        endSeconds: 3,
                      },
                      kind: 'video',
                    }, true)
                  ]
                },
            }
        },
        computed: {
            isDoneButtonEnabled() {
                return typeof this.guide.parts.find(p => p.hasContent) !== 'undefined';
            },
        },
        components: {
            ParameterDescriptorSynchronizer,
            GuidePartVideoEditor,
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
    @import '~@/assets/css/fonts.scss';
    @import '~@/assets/css/overwatch-ui.scss';
    @import '~@/assets/css/common.scss';

    .wrap {
        display: inline-flex;
        flex-direction: column;
        gap: .6em;

        .guide-part {
            @include overwatch-panel;
            padding: 1em;
            cursor: pointer;
            color: white;
            position: relative;

            &:first-of-type {
            }

            &:last-of-type {
            }
        }

        .guide-parts {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .guide-part-buttons > * {
            font-size: 2em;
        }

        .create-buttons {
            display: flex;
            justify-content: space-evenly;
            z-index: 1;
            margin: .3em;

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

        .descriptor-builder {
            z-index: 3;
            position: relative;
            width: 100%;
            /* For it to be positioned above everything else,
                   which is important when the dropdown is displayed
                   */
        }

        .create-new-part-button {
            white-space: nowrap;
        }
    }

</style>
