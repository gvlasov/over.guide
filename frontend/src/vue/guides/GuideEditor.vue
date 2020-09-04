<template>
    <div class="wrap root-content-sizer">
        <ParameterDescriptorSynchronizer
                v-model="guide.descriptor"
                base-path="/guide-editor/"
                :enabled="!pausedForDescriptorAnimation"
        />
        <div
                v-if="!preview"
                class="editor"
        >
            <LoginRequirement
                    v-if="loginRequired"
                    @back="loginRequired = false"
            >
                <template v-slot:notice>Publishing a guide requires logging in with Battle.net</template>
                <template v-slot:subnotice>Your current guide will be restored right away</template>
            </LoginRequirement>
            <div class="root-content-panel-wrap">
                <DescriptorBuilder
                        :descriptor="guide.descriptor"
                        :search-button-enabled="false"
                        class="descriptor-builder"
                        ref="descriptorBuilder"
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
                        v-hammer:tap="onDone"
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
            <div class="guide-parts root-content-panel-wrap">
                <div v-for="(widget, index) in guide.parts" :key="index" class="guide-part">
                    <GuidePartTextEditor
                            v-if="widget.part.kind === 'text'"
                            :widget="widget"
                    />
                    <GuidePartVideoEditor
                            v-if="widget.part.kind === 'video'"
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
                                v-if="widget.editing && partHasContent(widget.part)"
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
            </div>
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
                        v-hammer:tap="onDone"
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
        <div
                v-if="preview"
                class="preview root-content-panel-wrap"
        >
            <Guide
                    :guide="guide"
                    :search-descriptor="guide.descriptor"
                    :show-training-goal-button="false"
            />
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => preview = false"
            >Back
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    v-hammer:tap="publish"
            >publish
            </OverwatchButton>
        </div>
    </div>
</template>

<script>
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
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
import StoredGuideDraft from "@/js/StoredGuideDraft";
import GuideVso from "@/js/vso/GuideVso";
import debounce from 'lodash.debounce'
import LoginRequirement from "@/vue/LoginRequirement";
import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";
import DescriptorGenerator from "data/generators/DescriptorGenerator";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import Guide from "@/vue/guides/Guide";
import UserVso from "@/js/vso/UserVso";
import Authentication from "@/js/Authentication";

const backend = new Backend(axios);

const draft = new StoredGuideDraft()
export default {
    name: 'GuideEditor',
    model: {},
    props: {},
    watch: {
        guide: {
            handler: debounce(function (newValue) {
                draft.saveDraft(newValue);
            }, 500),
            deep: true,
        }
    },
    methods: {
        onDone() {
            if (this.guide.descriptor.isEmpty) {
                this.$scrollTo(this.$refs.descriptorBuilder.$el, 150, {
                    offset: -100,
                    onDone: () => {
                        this.shuffleDescriptor()
                    },
                })
            } else {
                this.wipeEmptyParts();
                this.preview = true;
            }
        },
        async publish() {
            const guideId = await backend.saveGuide(this.guide.toDto())
                .then(() => {
                    this.$router.push(
                        '/search/' +
                        new DescriptorParamUnparser().unparseDescriptor(
                            this.guide.descriptor
                        )
                    )
                    draft.reset()
                })
                .catch(error => {
                    if (error.response.status === 403) {
                        this.loginRequired = true;
                    }
                })
            if (guideId !== null) {
                this.guide.guideId = guideId
            }
        },
        shuffleDescriptor() {
            this.pausedForDescriptorAnimation = true;
            const emptyDescriptor =
                new GuideDescriptorVso(
                    new GuideDescriptorQuickie({})
                )
            const generator = new DescriptorGenerator({
                abilitiesPerHero: [0, 1],
                numberOfHeroTags: [0, 3],
                numberOfThematicTags: [0, 2]
            })
            let i = 0;
            const interval = setInterval(() => {
                this.guide.descriptor = new GuideDescriptorVso(
                    generator.generate(i)
                )
                i++
                if (i === 10) {
                    this.guide.descriptor = emptyDescriptor;
                    this.pausedForDescriptorAnimation = false;
                    clearInterval(interval)
                }
            }, 120)
        },
        wipeEmptyParts() {
            const emptyIndices = [];
            for (let index in this.guide.parts) {
                if (!this.guide.parts.hasOwnProperty(index)) {
                    continue;
                }
                const part = this.guide.parts[index];
                if (part.isEmpty) {
                    emptyIndices.push(index)
                }
            }
            let shift = 0;
            for (let index of emptyIndices) {
                this.guide.parts.splice(index - shift, 1);
                shift++;
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
        partHasContent(part) {
            if (part.kind === 'text') {
                return part.contentMd !== '';
            } else if (part.kind === 'video') {
                return part.excerpt !== null;
            } else {
                throw new Error('Unknown part type ' + part.kind)
            }
        }
    },
    data() {
        const params = new ParamsDescriptor(this.$route.params.descriptor);
        const draftGuide = draft.guide;
        let guide;
        if (draftGuide === null || draftGuide.parts.length === 0) {
            guide =
                new GuideVso({
                    id: undefined,
                    guideId: undefined,
                    descriptor: params.compute(),
                    parts: [],
                });
        } else {
            guide = draftGuide;
        }
        guide.createdAt = new Date().toISOString();
        guide.author = new UserVso({
            id: new Authentication().userId || 0,
            name: new Authentication().username || 'you',
        });
        return {
            guide: guide,
            loginRequired: false,
            pausedForDescriptorAnimation: false,
            preview: false,
        }
    },
    computed: {
        isDoneButtonEnabled() {
            return !this.pausedForDescriptorAnimation &&
                typeof this.guide.parts.find(widget => this.partHasContent(widget.part)) !== 'undefined';
        },
    },
    components: {
        LoginRequirement,
        ParameterDescriptorSynchronizer,
        GuidePartVideoEditor,
        OverwatchButton,
        DescriptorBuilder,
        YoutubeExcerptEditor,
        YoutubeVideo,
        GuidePartTextEditor,
        Guide,
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

    .preview {
        .guide {
            min-width: 100%;
            max-width: 100vw;
            margin-top: 2em;
            margin-bottom: 2em;
        }

        & > button {
            font-size: 2em;
        }
    }
}

</style>
