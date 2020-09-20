<template>
    <div class="guide-part">
        <template v-if="widget.part.kind === 'text'">
            <MarkdownGuide
                    v-if="showMarkdownGuide && !widget.editing && widget.part.kind === 'text'"
                    @back="onMarkdownGuideBack"
            />
            <OverwatchButton
                    v-if="!showMarkdownGuide && widget.editing && widget.part.kind === 'text'"
                    type="default"
                    class="markup-help-button"
                    v-hammer:tap="() => {showMarkdownGuide = true; widget.editing = false;}"
            >Formatting guide
            </OverwatchButton>
        </template>
        <template v-if="!showMarkdownGuide">
            <GuidePartTextEditor
                    v-if="widget.part.kind === 'text'"
                    :widget="widget"
                    @save="() => widget.editing = false"
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
                        v-if="widget.editing"
                        type="default"
                        class="view-button"
                        v-hammer:tap="() => widget.editing = false"
                        :disabled="widget.isEmpty"
                >Save
                </OverwatchButton>
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => deletePart(index)"
                >Delete
                </OverwatchButton>
                <div class="move-guide-buttons">
                    <OverwatchPanelButton
                            :disabled="index === parts.length - 1"
                            type="default"
                            v-hammer:tap="() => movePartDown(index)"
                    >
                        <img src="/icons/arrow-down-white.svg"/>
                    </OverwatchPanelButton>
                    <OverwatchPanelButton
                            :disabled="index === 0"
                            type="default"
                            v-hammer:tap="() => movePartUp(index)"
                    >
                        <img src="/icons/arrow-up-white.svg"/>
                    </OverwatchPanelButton>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import GuidePartWidget from "@/ts/vso/GuidePartWidget";
import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartTextEditor from "@/vue/guides/editor/GuidePartTextEditor";
import GuidePartVideoEditor from "@/vue/guides/editor/GuidePartVideoEditor";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import MarkdownGuide from "@/vue/guides/editor/MarkdownGuide";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";


@Component({
    components: {
        OverwatchPanelButton,
        GuidePartVideoEditor,
        OverwatchButton,
        YoutubeExcerptEditor,
        GuidePartTextEditor,
        MarkdownGuide,
    },
})
export default class GuidePart extends Vue {
    @Prop({required: true})
    widget: GuidePartWidget

    @Prop({required: true})
    parts: (GuidePartTextDto | GuidePartVideoDto)[]

    @Prop({required: true})
    index: number

    declare $scrollTo: any

    showMarkdownGuide: boolean = false

    onMarkdownGuideBack() {
        this.showMarkdownGuide = false;
        this.widget.editing = true;
        this.$scrollTo(
            this.$el,
            150,
            {
                offset: -100,
                onDone: () => {
                    (this.$refs.textarea as HTMLInputElement).focus();
                },
            }
        );
    }

    movePartUp(index) {
        this.movePart(index, -1)
    }

    movePartDown(index) {
        this.movePart(index, 1)
    }

    movePart(index, d) {
        const elem = this.parts[index]
        this.parts.splice(index, 1)
        this.parts.splice(index + d, 0, elem)
        this.$scrollTo(this.$el)
    }

    deletePart(index) {
        this.parts.splice(index, 1);
    }

    partHasContent(part) {
        if (part.kind === 'text') {
            return part.contentMd !== '';
        } else if (part.kind === 'video') {
            return part.excerpt !== null;
        } else {
            throw new Error('Unknown part type ' + part.kind)
        }
    }

    @Watch('widget.editing')
    onWidgetEditingChange(newValue) {
        if (newValue) {
            this.showMarkdownGuide = false;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.guide-part {
    @include overwatch-panel;
    padding: 1em;
    color: white;
    position: relative;

    .markup-help-button {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 1.2em;

        & ::v-deep .background {
            background-color: rgba(81, 96, 148, 0.7)
        }
    }

    .guide-part-buttons {
        position: relative;
        margin-top: 2em;

        & > * {
            font-size: 2em;
        }

        .move-guide-buttons {
            position: absolute;
            right: 0;
            display: inline-block;

            button {
                height: 100%;

                & ::v-deep .content {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                & ::v-deep img {
                    height: .7em;
                }

                & ::v-deep .background {
                    background-color: rgba(81, 96, 148, 0.7);
                }

                &[disabled] ::v-deep .background {
                    background-color: transparent;
                }
            }
        }
    }
}

</style>
