<template>
    <div class="wrap root-content-sizer">
        <div v-if="$asyncComputed.head.updating">
            {{ $asyncComputed.head.state }}
            <BackgroundHeading>Loading</BackgroundHeading>
            {{ JSON.stringify($asyncComputed.head) }}
        </div>
        <div v-else-if="guideNotFound">
            <BackgroundHeading>Guide not found</BackgroundHeading>
        </div>
        <template v-else>
            <ParameterDescriptorSynchronizer
                    v-if="isNewGuide"
                    v-model="head.entry.descriptor"
                    base-path="/guide-editor/"
            />
            <NotificationModalPopup
                    v-if="loginRequired"
                    @close="loginRequired = false"
            >
                <LoginRequirement
                        @back="loginRequired = false"
                >
                    <template v-slot:notice>Publishing a guide requires logging in with Battle.net</template>
                    <template v-slot:subnotice>Your current guide will be restored right away</template>
                </LoginRequirement>
            </NotificationModalPopup>
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
                <DescriptorBuilder
                        v-model="head.entry.descriptor"
                        :search-button-enabled="false"
                        class="descriptor-builder"
                        v-bind:class="{'forced-descriptor': forceDescriptorSelection}"
                >
                    <div
                            v-if="!head.entry.descriptor.isEmpty"
                            class="similar-tag-guides-wrap"
                    >
                        <SimilarTagGuides
                                :descriptor="head.entry.descriptor"
                        />
                    </div>
                </DescriptorBuilder>
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
                            :disabled="head.entry.descriptor.isEmpty"
                            v-hammer:tap="() => {forceDescriptorSelection = false; preview = true}"
                    >Done
                    </OverwatchButton>
                </div>
                <template v-else>
                    <div class="public-private-buttons">
                        <transition name="public-private">
                            <OverwatchButton
                                    v-if="head.entry.isPublic"
                                    key="public"
                                    type="default"
                                    v-hammer:tap="() => head.entry.isPublic = false"
                            >public
                            </OverwatchButton>
                            <OverwatchButton
                                    v-else
                                    key="private"
                                    type="default"
                                    class="private"
                                    v-hammer:tap="() => head.entry.isPublic = true"
                            >private
                            </OverwatchButton>
                        </transition>
                    </div>
                    <GuideEditorPartsList :entry="head.entry"/>
                    <OverwatchButton
                            type="main"
                            class="preview-button"
                            v-hammer:tap="onDone"
                            data-type="text"
                            :disabled="!isDoneButtonEnabled"
                            :show-buttons="false"
                    >Preview
                    </OverwatchButton>
                </template>
            </div>
            <div
                    v-if="preview"
                    class="preview"
            >
                <BackgroundHeading>Preview</BackgroundHeading>
                <GuidePreview
                        :head="head"
                        :search-descriptor="head.entry.descriptor"
                />
                <div class="preview-buttons">
                    <OverwatchButton
                            type="default"
                            v-hammer:tap="() => preview = false"
                    >Edit
                    </OverwatchButton>
                    <OverwatchButton
                            type="main"
                            v-hammer:tap="publish"
                    >{{ head.entry.isPublic ? 'publish' : 'save' }}
                    </OverwatchButton>
                </div>
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
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import ModalPopup from "@/vue/general/ModalPopup.vue";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";

const Debounce = require('debounce-decorator').default

const backend = new Backend(axios);

const draft = new StoredGuideDraft()

@Component({
    components: {
        NotificationModalPopup,
        ModalPopup,
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
        if (this.head.entry.descriptor.isEmpty) {
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
            this.head instanceof ExistingGuideHeadVso
                ? backend.updateGuide(this.head.entry.toDto())
                : backend.createGuide(this.head.entry.toDto())
        )
            .then((guideId) => {
                if (guideId === void 0) {
                    guideId = (this.head.entry as ExistingGuideHistoryEntryVso).guideId
                }
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
        for (let index in this.head.entry.parts) {
            if (!this.head.entry.parts.hasOwnProperty(index)) {
                continue;
            }
            const part = this.head.entry.parts[index];
            if (part.isEmpty) {
                emptyIndices.push(index)
            }
        }
        let shift = 0;
        for (let index of emptyIndices) {
            this.head.entry.parts.splice(index - shift, 1);
            shift++;
        }
    }

    get isRouteForNewGuide(): boolean {
        return this.$route.params.id === void 0 || this.$route.params.id === 'new'
    }

    declare head: NewGuideHeadVso | ExistingGuideHeadVso

    @AsyncComputedProp()
    async head() {
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
        return this.head.entry.parts.find(widget => !widget.isEmpty) !== void 0;
    }

    get isNewGuide(): boolean {
        return this.head instanceof NewGuideHeadVso
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

    .editor {
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        .parts-list {
            z-index: 1;
        }

        .public-private-buttons {
            position: relative;
            overflow: hidden;
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

        .preview-button {
            width: 100%;
            height: 3em;
            margin-top: 3em;
            margin-bottom: 6em;
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

        .preview-buttons {
            display: flex;
            justify-content: stretch;
            flex-wrap: nowrap;
            gap: 1em;

            button {
                flex-grow: 1;
                height: 3em;
            }
        }
    }
}

</style>
