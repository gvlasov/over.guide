<template>
    <div class="guide-part">
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
            <div class="move-guide-buttons">
                <OverwatchPanelButton
                        :disabled="index === guide.parts.length - 1"
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
    </div>
</template>

<script>
import GuidePartWidget from "@/js/vso/GuidePartWidget";
import YoutubeExcerptEditor from "@/vue/videos/YoutubeExcerptEditor";
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartTextEditor from "@/vue/guides/GuidePartTextEditor";
import GuidePartVideoEditor from "@/vue/guides/GuidePartVideoEditor";
import GuideVso from "@/js/vso/GuideVso";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";

export default {
    props: {
        widget: {
            type: GuidePartWidget,
            required: true,
        },
        guide: {
            type: GuideVso,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        }
    },
    methods: {
        movePartUp(index) {
            this.movePart(index, -1)
        },
        movePartDown(index) {
            this.movePart(index, 1)
        },
        movePart(index, d) {
            const elem = this.guide.parts[index]
            this.guide.parts.splice(index, 1)
            this.guide.parts.splice(index + d, 0, elem)
            this.$scrollTo(this.$el)
        },
        deletePart(index) {
            this.guide.parts.splice(index, 1);
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
        return {}
    },
    computed: {},
    components: {
        OverwatchPanelButton,
        GuidePartVideoEditor,
        OverwatchButton,
        YoutubeExcerptEditor,
        GuidePartTextEditor,
    },
};

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
