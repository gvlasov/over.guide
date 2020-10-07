<template>
    <div class="wrap root-content-sizer">
        <div v-if="$asyncComputed.guide.updating">
            {{ $asyncComputed.guide.state }}
            <BackgroundHeading>Loading</BackgroundHeading>
            {{ JSON.stringify($asyncComputed.guide) }}
        </div>
        <div v-else-if="guideNotFound">
            <BackgroundHeading>Guide not found</BackgroundHeading>
        </div>
        <template v-else>
            <ParameterDescriptorSynchronizer
                    v-if="isNewGuide"
                    v-model="guide.entry.descriptor"
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
                            :descriptor="guide.entry.descriptor"
                            :search-button-enabled="false"
                            class="descriptor-builder"
                            v-bind:class="{'forced-descriptor': forceDescriptorSelection}"
                    >
                        <div
                                v-if="!guide.entry.descriptor.isEmpty"
                                class="similar-tag-guides-wrap"
                        >
                            <SimilarTagGuides
                                    :descriptor="guide.entry.descriptor"
                            />
                        </div>
                    </DescriptorBuilder>
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
                            :disabled="guide.entry.descriptor.isEmpty"
                            v-hammer:tap="() => {forceDescriptorSelection = false; preview = true}"
                    >Done
                    </OverwatchButton>
                </div>
                <div v-else>
                    <div class="public-private-buttons">
                        <transition name="public-private">
                            <OverwatchButton
                                    v-if="guide.entry.isPublic"
                                    key="public"
                                    type="default"
                                    v-hammer:tap="() => guide.entry.isPublic = false"
                            >public
                            </OverwatchButton>
                            <OverwatchButton
                                    v-else
                                    key="private"
                                    type="default"
                                    class="private"
                                    v-hammer:tap="() => guide.entry.isPublic = true"
                            >private
                            </OverwatchButton>
                        </transition>
                    </div>
                    <GuideEditorPartsList :entry="guide.entry"/>
                    <div>
                        <OverwatchButton
                                type="main"
                                class="done-button"
                                v-hammer:tap="onDone"
                                data-type="text"
                                :disabled="!isDoneButtonEnabled"
                                :show-buttons="false"
                        >Preview
                        </OverwatchButton>
                    </div>
                </div>
            </div>
            <div
                    v-if="preview"
                    class="preview root-content-panel-wrap"
            >
                <BackgroundHeading>Preview</BackgroundHeading>
                <GuidePreview
                        :head="guide"
                        :search-descriptor="guide.entry.descriptor"
                />
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => preview = false"
                >Edit
                </OverwatchButton>
                <OverwatchButton
                        type="main"
                        v-hammer:tap="publish"
                >{{guide.entry.isPublic ? 'publish' : 'save'}}
                </OverwatchButton>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/ts/Backend";
import axios from 'axios';
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer";
import StoredGuideDraft from "@/ts/StoredGuideDraft";
import LoginRequirement from "@/vue/LoginRequirement";
import Guide from "@/vue/guides/Guide";
import BackgroundHeading from "@/vue/BackgroundHeading";
import GuideEditorPartsList from "@/vue/guides/editor/GuideEditorPartsList";
import ParamsDescriptorMixin from "@/ts/ParamsDescriptorMixin";
import SimilarTagGuides from "@/vue/guides/editor/SimilarTagGuides";
import Component, {mixins} from "vue-class-component";
import {Watch} from "vue-property-decorator";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import NewGuideHeadVso from "@/ts/vso/NewGuideHeadVso";
import AsyncComputedProp from "vue-async-computed-decorator";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";
import GuidePreview from "@/vue/guides/GuidePreview.vue";

const Debounce = require('debounce-decorator').default

const backend = new Backend(axios);

const draft = new StoredGuideDraft()

@Component({
    components: {
        GuidePreview,
        SimilarTagGuides,
        GuideEditorPartsList,
        LoginRequirement,
        ParameterDescriptorSynchronizer,
        OverwatchButton,
        DescriptorBuilder,
        Guide,
        BackgroundHeading,
    },
})
export default class GuideEditor extends mixins(ParamsDescriptorMixin) {

    loginRequired: boolean = false
    preview: boolean = false
    forceDescriptorSelection: boolean = false
    guideNotFound: boolean = false

    $scrollTo: any


    @Watch('guide', {deep: true})
    @Debounce(500)
    onGuideChange(newValue: NewGuideHeadVso | ExistingGuideHeadVso) {
        if (newValue.entry instanceof NewGuideHistoryEntryVso) {
            if (newValue.entry.isEmpty) {
                draft.reset();
            } else {
                draft.saveDraft(newValue.entry);
            }
        }
    }

    onDone() {
        if (this.guide.entry.descriptor.isEmpty) {
            this.forceDescriptorSelection = true;
        } else {
            this.wipeEmptyParts();
            this.preview = true;
        }
        this.$scrollTo(this.$el, {
            force: true,
        })
    }

    publish() {
        (
            this.guide instanceof ExistingGuideHeadVso
                ? backend.updateGuide(this.guide.entry.toDto())
                : backend.createGuide(this.guide.entry.toDto())
        )
            .then((guideId) => {
                this.$router.push(`/guide/${guideId}`)
                draft.reset()
            })
            .catch(error => {
                if (error.response.status === 403) {
                    this.loginRequired = true;
                }
            })
    }

    wipeEmptyParts() {
        const emptyIndices = [];
        for (let index in this.guide.entry.parts) {
            if (!this.guide.entry.parts.hasOwnProperty(index)) {
                continue;
            }
            const part = this.guide.entry.parts[index];
            if (part.isEmpty) {
                emptyIndices.push(index)
            }
        }
        let shift = 0;
        for (let index of emptyIndices) {
            this.guide.entry.parts.splice(index - shift, 1);
            shift++;
        }
    }

    get isRouteForNewGuide(): boolean {
        return this.$route.params.id === void 0 || this.$route.params.id === 'new'
    }

    declare guide: NewGuideHeadVso | ExistingGuideHeadVso

    @AsyncComputedProp()
    async guide() {
        if (this.isRouteForNewGuide) {
            const draftGuide = draft.guide;
            if (draftGuide !== null) {
                const newGuideHeadVso = new NewGuideHeadVso(
                    {
                        guideHistoryEntry: {
                            ...draftGuide,
                        },
                        commentsCount: 0,
                        votesCount: 0
                    }
                );
                if (!newGuideHeadVso.entry.isEmpty) {
                    return newGuideHeadVso
                }
            }
            return new NewGuideHeadVso({
                guideHistoryEntry: {
                    descriptor: this.obtainParamsDescriptor(),
                    parts: [],
                    isPublic: true,
                },
                commentsCount: 0,
                votesCount: 0,
            });
        } else {
            return await backend.getGuide(
                Number.parseInt(this.$route.params.id)
            )
                .then(dto => {
                    return new ExistingGuideHeadVso(dto)
                })
                .catch(e => {
                    if (e.response.status === 404) {
                        this.guideNotFound = true;
                    } else {
                        throw e;
                    }
                    return new NewGuideHeadVso({
                        guideHistoryEntry: {
                            descriptor: new GuideDescriptorQuickie({}),
                            parts: [],
                            isPublic: true,
                        },
                        votesCount: 0,
                        commentsCount: 0,
                    })
                });
        }
    }

    get isDoneButtonEnabled(): boolean {
        return this.guide.entry.parts.find(widget => !widget.isEmpty) !== void 0;
    }

    get isNewGuide(): boolean {
        return this.guide instanceof NewGuideHeadVso
    }
}
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

        .public-private-buttons {
            position: relative;
            height: 3em;
            padding: 1em 0;

            button {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateX(0) translateY(-50%);
                opacity: 1;
            }

            button.private ::v-deep .background {
                background-color: hsl(0, 0%, 40%, .88);
            }

            .public-private-leave-active {
                transition: transform .13s ease-in, opacity .13s ease-in;
            }

            .public-private-leave {
                opacity: 1;
                transform: translateX(-50%) translateX(0) translateY(-50%);
            }

            .public-private-leave-to {
                opacity: 0;
                transform: translateX(-50%) translateX(-8em) translateY(-50%);
            }

            .public-private-enter-active {
                transition: transform .13s ease-in, opacity .13s ease-in;
            }

            .public-private-enter {
                opacity: 0;
                transform: translateX(-50%) translateX(8em) translateY(-50%);
            }

            .public-private-enter-to {
                opacity: 1;
                transform: translateX(-50%) translateX(0) translateY(-50%);
            }
        }


        .similar-tag-guides-wrap {
            flex-basis: 100%;
            max-width: 100%;
            flex-grow: 0;
            flex-shrink: 0;
            z-index: 1;
            padding: 0 .4em;
            box-sizing: border-box;

            .similar-tag-guides {
                max-width: 100%;

                & ::v-deep button {
                    border-radius: .2em;
                }
            }
        }

        .guide-parts {
            display: flex;
            flex-direction: column;
            gap: 2rem;
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
            font-size: 2.2em;
            margin: 3em 1em .5em 1em;
            text-shadow: 0 0 .15em hsl(279, 30%, 30%);

            @include overwatch-futura;
        }

        .force-descriptor-buttons {
            button {
                font-size: 2em;
            }
        }

    }

    .preview {
        .guide-preview {
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
