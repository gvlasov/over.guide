<template>
    <div class="wrap root-content-sizer">
        <div v-if="guideNotFound">
            <BackgroundHeading>Guide not found</BackgroundHeading>
        </div>
        <div v-else-if="guide === null">
            <BackgroundHeading>Loading</BackgroundHeading>
        </div>
        <template v-else>
            <ParameterDescriptorSynchronizer
                    v-if="isNewGuide"
                    v-model="guide.descriptor"
                    base-path="/guide-editor/"
            />
            <LoginRequirement
                    v-if="loginRequired"
                    @back="loginRequired = false"
            >
                <template v-slot:notice>Publishing a guide requires logging in with Battle.net</template>
                <template v-slot:subnotice>Your current guide will be restored right away</template>
            </LoginRequirement>
            <div
                    v-if="!preview"
                    class="editor"
            >
                <div
                        v-if="forceDescriptorSelection"
                        class="force-descriptor-notice"
                >
                    What is your guide about?
                </div>
                <div
                        class="root-content-panel-wrap"
                >
                    <DescriptorBuilder
                            :descriptor="guide.descriptor"
                            :search-button-enabled="false"
                            class="descriptor-builder"
                            v-bind:class="{'forced-descriptor': forceDescriptorSelection}"
                            @descriptorChange="(newDescriptor) => {guide.descriptor = newDescriptor}"
                    />
                </div>
                <div
                        v-if="forceDescriptorSelection"
                        class="force-descriptor-buttons"
                >
                    <OverwatchButton
                            type="default"
                            v-hammer:tap="() => forceDescriptorSelection = false"
                    >Back
                    </OverwatchButton>
                    <OverwatchButton
                            type="main"
                            :disabled="guide.descriptor.isEmpty"
                            v-hammer:tap="() => {forceDescriptorSelection = false; preview = true}"
                    >Done
                    </OverwatchButton>
                </div>
                <div v-else>
                    <transition name="new-buttons-appear">
                        <GuidePartSpawner
                                v-if="!beginningSpawnerHidden"
                                where="beginning"
                                :initial-seeding="guide.parts.length === 0"
                                @addVideo="createNewVideoPart"
                                @addText="createNewTextPart"
                        />
                    </transition>
                    <transition-group
                            class="guide-parts root-content-panel-wrap"
                            name="appear"
                            @before-enter="beforeEnter"
                            :v-enter-to="enterToClass"
                    >
                        <GuidePart
                                v-for="(widget, index) in guide.parts"
                                :key="widget.id"
                                ref="guideParts"
                                :widget="widget"
                                :parts="guide.parts"
                                :index="index"
                        />
                    </transition-group>
                    <transition name="new-buttons-appear">
                        <GuidePartSpawner
                                v-if="endSpawnerEnabled"
                                where="end"
                                :initial-seeding="false"
                                @addVideo="createNewVideoPart"
                                @addText="createNewTextPart"
                        />
                    </transition>
                    <div>
                        <OverwatchButton
                                type="main"
                                class="done-button"
                                v-hammer:tap="onDone"
                                data-type="text"
                                :disabled="!isDoneButtonEnabled"
                                :show-buttons="false"
                        >Done
                        </OverwatchButton>
                    </div>
                </div>
            </div>
            <div
                    v-if="preview"
                    class="preview root-content-panel-wrap"
            >
                <BackgroundHeading>Preview</BackgroundHeading>
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
        </template>
    </div>
</template>

<script>
import GuidePartWidget from "@/js/vso/GuidePartWidget";
import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/js/Backend";
import axios from 'axios';
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import ParamsDescriptor from "@/js/ParamsDescriptor";
import StoredGuideDraft from "@/js/StoredGuideDraft";
import GuideVso from "@/js/vso/GuideVso";
import debounce from 'lodash.debounce'
import LoginRequirement from "@/vue/LoginRequirement";
import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";
import Guide from "@/vue/guides/Guide";
import UserVso from "@/js/vso/UserVso";
import Authentication from "@/js/Authentication";
import GuidePart from "@/vue/guides/GuidePart";
import BackgroundHeading from "@/vue/BackgroundHeading";
import GuidePartSpawner from "@/vue/guides/GuidePartSpawner";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";

const backend = new Backend(axios);

const draft = new StoredGuideDraft()
export default {
    name: 'GuideEditor',
    watch: {
        guide: {
            handler: debounce(function (newValue) {
                if (this.isNewGuide) {
                    draft.saveDraft(newValue);
                }
            }, 500),
            deep: true,
        },
    },
    methods: {
        beforeEnter() {
            this.beginningSpawnerHidden = false;
            this.endSpawnerHidden = false
        },
        createNewTextPart(where) {
            this.spawnPart(
                () => new GuidePartTextWidget(
                    {
                        kind: 'text',
                        contentMd: ''
                    },
                    true
                ),
                where
            );
        },
        createNewVideoPart(where) {
            this.spawnPart(
                () =>
                    new GuidePartVideoWidget(
                        {
                            kind: 'video',
                            excerpt: null,
                        },
                        true
                    ),
                where
            );
        },
        spawnPart(how, where) {
            this[where + 'SpawnerHidden'] = true;
            const part = how();
            this.enterToClass = part.kind === 'text'
                ? 'appear-enter-to-text'
                : 'appear-enter-to-video';
            this.$nextTick(() => {
                (
                    (where === 'beginning')
                        ? this.guide.parts.unshift
                        : this.guide.parts.push
                )
                    .apply(this.guide.parts, [part]);
            })
        },
        onDone() {
            if (this.guide.descriptor.isEmpty) {
                this.forceDescriptorSelection = true;
            } else {
                this.wipeEmptyParts();
                this.preview = true;
            }
            this.$scrollTo(this.$el, {
                force: true,
            })
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
        readGuide() {
            let guide;
            let guideId;
            if (typeof this.$route.params.id === "undefined" || this.$route.params.id === 'new') {
                guideId = undefined;
                const draftGuide = draft.guide;
                if (draftGuide !== null && draftGuide.parts.length !== 0) {
                    guide = draftGuide;
                }
            } else {
                return null;
            }
            if (typeof guide === 'undefined') {
                const params = new ParamsDescriptor(this.$route.params.descriptor);
                guide =
                    new GuideVso({
                        id: undefined,
                        guideId: undefined,
                        descriptor: params.compute(),
                        parts: [],
                    });
            }
            if (typeof guide !== 'undefined') {
                guide.createdAt = new Date().toISOString();
                guide.author = new UserVso({
                    id: new Authentication().userId || 0,
                    name: new Authentication().username || 'you',
                });
            }
            return guide;
        },
    },
    data() {
        return {
            guide: this.readGuide(),
            loginRequired: false,
            preview: false,
            forceDescriptorSelection: false,
            guideNotFound: false,
            beginningSpawnerHidden: false,
            endSpawnerHidden: false,
            enterToClass: undefined,
        }
    },
    mounted() {
        if (this.guide === null) {
            backend.getGuide(
                Number.parseInt(this.$route.params.id)
            )
                .then(dto => {
                    this.guide = new GuideVso(dto)
                })
                .catch(e => {
                    if (e.response.status === 404) {
                        this.guideNotFound = true;
                    } else {
                        throw e;
                    }
                });
        }
    },
    computed: {
        isDoneButtonEnabled() {
            return typeof this.guide.parts.find(widget => !widget.isEmpty) !== 'undefined';
        },
        isNewGuide() {
            return typeof this.guide.guideId === 'undefined';
        },
        beginningSpawnerEnabled() {
            return !this.beginningSpawnerHidden;
        },
        endSpawnerEnabled() {
            return this.guide.parts.length > 0 && !this.endSpawnerHidden;
        }
    },
    components: {
        GuidePartSpawner,
        LoginRequirement,
        ParameterDescriptorSynchronizer,
        OverwatchButton,
        DescriptorBuilder,
        Guide,
        GuidePart,
        BackgroundHeading,
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
    padding-bottom: 6em;

    .editor {
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        .guide-parts {
            display: flex;
            flex-direction: column;
            gap: 2rem;

            .guide-part {
                overflow: hidden;

                &.appear-enter {
                    max-height: 5em;
                }

                &.appear-enter-to-text {
                    max-height: 12em;
                }

                &.appear-enter-to-video {
                    max-height: 9em;
                }

                &.appear-enter-active {
                    transition: max-height .2s ease-out,
                    opacity .2s ease-out;
                }

                &:first-child {
                    margin-top: 2em;
                }
            }
        }

        .part-spawner {
            margin-top: 2rem;
            max-height: 15em;
            opacity: 1;

            $new-buttons-animation-duration: .2s;

            &.new-buttons-appear-enter {
                max-height: 0;
                margin-top: 0;
                opacity: 0;
            }

            &.new-buttons-appear-enter-active {
                transition: max-height $new-buttons-animation-duration ease-out,
                margin-top $new-buttons-animation-duration ease-out;
            }
        }

        .done-button {
            margin-top: 3em;
        }

        .descriptor-builder {
            z-index: 3;
            position: relative;
            width: 100%;
            /* For it to be positioned above everything else,
                   which is important when the dropdown is displayed
                   */
            &.forced-descriptor {
                margin-bottom: 3em;
            }
        }

        .force-descriptor-notice {
            font-size: 2em;
            margin: 3em 1em 0 1em;

            @include overwatch-futura;
        }

        .force-descriptor-buttons {
            button {
                font-size: 2em;
            }
        }

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
