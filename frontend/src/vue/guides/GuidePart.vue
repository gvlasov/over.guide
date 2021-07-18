<template>
    <OverwatchPanel class="guide-part" v-bind:id="elementId(widget)">
        <template v-if="widget.isText">
            <MarkdownGuide
                    v-if="showMarkdownGuide && !widget.editing && widget.isText"
                    @back="onMarkdownGuideBack"
            />
            <OverwatchButton
                    v-if="!showMarkdownGuide && widget.editing && widget.isText"
                    type="default"
                    class="markup-help-button"
                    v-hammer:tap="() => {showMarkdownGuide = true; widget.editing = false;}"
            >Formatting guide
            </OverwatchButton>
        </template>
        <div class="move-guide-buttons">
            <div class="guide-part-number">
                {{ index + 1 }}/{{ parts.length }}
            </div>
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
        <template v-if="!showMarkdownGuide">
            <GuidePartTextEditor
                    v-if="widget.isText"
                    :widget="widget"
                    @save="() => widget.editing = false"
            />
            <YoutubeVideoLinkForm
                    v-if="widget.isVideo && widget.part.excerpt.youtubeVideoId === ''"
                    @videoSelection="onVideoSelection"
            />
            <GuidePartVideoEditor
                    v-if="widget.isVideo && widget.part.excerpt.youtubeVideoId !== ''"
                    :widget="widget"
                    :index="index"
                    :entry="entry"
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
            </div>
        </template>
    </OverwatchPanel>
</template>

<script lang="ts">
import GuidePartWidget from "@/ts/vso/GuidePartWidget";
import YoutubeExcerptEditor from "@/vue/guides/editor/YoutubeExcerptEditor";
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
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import YoutubeUrlVso from "@/ts/vso/YoutubeUrlVso";
import YoutubeVideoLinkForm from "@/vue/guides/editor/YoutubeVideoLinkForm.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";

@Component({
    components: {
        OverwatchPanel,
        OverwatchPanelButton,
        GuidePartVideoEditor,
        OverwatchButton,
        YoutubeExcerptEditor,
        GuidePartTextEditor,
        MarkdownGuide,
        YoutubeVideoLinkForm,
    },
})
export default class GuidePart extends Vue {
    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso|NewGuideHistoryEntryVso

    @Prop({required: true})
    widget: GuidePartWidget

    @Prop({required: true})
    parts: (GuidePartTextDto | GuidePartVideoDto)[]

    @Prop({required: true})
    index: number

    declare $scrollTo: any

    showMarkdownGuide: boolean = false

    onVideoSelection(url: YoutubeUrlVso) {
        const timestampSeconds = url.timestampSeconds;
        let startSeconds, endSeconds;
        if (timestampSeconds !== null) {
            startSeconds = url.timestampSeconds - 4
            endSeconds = url.timestampSeconds + 1
        } else {
            startSeconds = 0
            endSeconds = null
        }
        const part = this.widget.part as GuidePartVideoDto;
        part.excerpt = {
            youtubeVideoId: url.videoId,
            startSeconds: startSeconds,
            endSeconds: endSeconds,
            thumbnail: part.excerpt.thumbnail,
        };
    }

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

    elementId(widget: GuidePartWidget) {
        return 'guide-part-' + widget.id;
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
        this.$nextTick(() => {
            const element = document.getElementById(this.elementId(this.widget));
            this.$scrollTo(
                element,
                {
                    // https://github.com/rigor789/vue-scrollto/issues/36#issuecomment-313853007                }
                    cancelable: false,
                    offset: this.getScrollOffsetY(),
                }
            )
        })
    }

    getScrollOffsetY() {
        // TODO: Replace with scroll snap when browsers get good support:
        // https://developers.google.com/web/updates/2018/07/css-scroll-snap
        const navigationBar = document.getElementsByClassName('navigation-bar')[0];
        return (getComputedStyle(navigationBar).bottom === '0px'
                ? 0
                : -navigationBar.clientHeight
        ) - parseFloat(getComputedStyle(this.$el).fontSize) * 1.4;
    }

    deletePart(index) {
        this.parts.splice(index, 1);
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
    padding: 1em;
    color: white;
    position: relative;
    scroll-padding-top: 2em;
    scroll-padding-bottom: 2em;

    .markup-help-button {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 1.2em;

        & ::v-deep .background {
            background-color: rgba(81, 96, 148, 0.7)
        }
    }

    .move-guide-buttons {
        display: block;
        text-align: right;
        overflow: visible;

        .guide-part-number {
            @include overwatch-futura;
            font-size: 1.3em;
            line-height: 1em;
            display: inline-block;
            height: 1em;
            vertical-align: middle;
            padding-right: .3em;
        }

        button {
            vertical-align: middle;

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

    .guide-part-buttons {
        position: relative;
        margin-top: 2em;

        & > * {
            font-size: 2em;
        }

    }

    & ::v-deep .guide-video {
        margin-top: .3em;
    }

    & ::v-deep .guide-part-video-editor {
        margin-top: .3em;
    }
}

</style>
