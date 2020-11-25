<template>
    <div class="guide-preview-badge">
        <div
                v-if="open"
                class="uncollapsed"
        >
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => {$emit('close');}"
            >Close
            </OverwatchButton>
            <Guide
                    :head="head"
                    :show-training-goal-button="false"
                    :search-descriptor="null"
            />
        </div>
        <div
                v-else
                class="collapsed"
                v-bind:class="{deleted: ghost, private: !head.entry.isPublic}"
        >
            <OverwatchPanel
                    class="opacity"
                    v-hammer:tap="() => {$emit('open')}"
            >
                <div class="tags">
                    <HeroTag
                            v-if="head.entry.descriptor.hasHeroes"
                            class="hero-tag"
                            :descriptor="head.entry.descriptor"
                    />
                    <TagBadges :descriptor="head.entry.descriptor"/>
                </div>
                <GuidePartText
                        v-if="typeof firstTextWidget !== 'undefined'"
                        :part="firstTextWidget.part"
                />
                <div
                        v-if="firstVideoWidget !== void 0"
                        class="unclickable"
                >
                    <AspectRatioBox>
                        <VideoPreview
                                :excerpt="firstVideoWidget.part.excerpt"
                        />
                    </AspectRatioBox>
                </div>
            </OverwatchPanel>
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/ts/Backend";
import axios from 'axios';
import HeroTag from "@/vue/guides/tags/hero/HeroTag";
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import AspectRatioBox from "@/vue/AspectRatioBox";
import GuidePartText from "@/vue/guides/GuidePartText";
import Guide from "@/vue/guides/Guide";
import TagBadges from "@/vue/guides/TagBadges";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import GuidePartTextWidget from "@/ts/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import Component from "vue-class-component";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import VideoLoadingScreen from "@/vue/VideoLoadingScreen.vue";
import VideoPreview from "@/vue/VideoPreview.vue";

const backend = new Backend(axios);

@Component({
    components: {
        VideoPreview,
        VideoLoadingScreen,
        OverwatchPanel,
        TagBadges,
        GuidePartText,
        AspectRatioBox,
        Guide,
        ThematicTagBadge,
        HeroTag,
        OverwatchButton,
        YoutubeVideo,
    },
})
export default class GuidePreviewBadge extends Vue {

    @Prop({required: true})
    head: ExistingGuideHeadVso

    @Prop({default: false})
    open: boolean

    @Prop({required: true})
    order: number

    @Prop({default: false})
    ghost: boolean

    removeTrainingGoal() {
        MyTrainingGoalsCache.instance()
            .removeGoal(this.head.entry.guideId)
    }

    get firstVideoWidget(): GuidePartVideoWidget | undefined {
        return this.head.entry.parts.find(widget => widget.isVideo) as GuidePartVideoWidget
    }

    get firstTextWidget(): GuidePartTextWidget {
        return this.head.entry.parts.find(widget => widget.isText) as GuidePartTextWidget
    }
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.guide-preview-badge {
    $training-goal-height: 4em;
    @include overwatch-futura-no-smallcaps;
    --left-border-radius: .6rem;
    box-sizing: border-box;

    .collapsed {
        display: flex;
        min-height: $training-goal-height;
        cursor: pointer;
        box-shadow: 0 .1rem .3rem $overwatch-panel-bg-color;
        border-radius: var(--left-border-radius) 0 0 var(--left-border-radius);


        $private-color: hsl(170, 0, 32%);

        &.private > .overwatch-panel {
            background-color: rgba($private-color, .7);
        }

        &.private {
            box-shadow: 0 .1rem .3rem rgba($private-color, .5);
        }

        &.deleted {
            box-shadow: 0 .1em .3em rgba($overwatch-panel-bg-color, .5);

            .opacity {
                opacity: .3;
            }
        }

        .opacity {
            flex-grow: 1;
            display: flex;
            overflow: hidden;
            border-radius: var(--left-border-radius) 0 0 var(--left-border-radius);
            box-shadow: none;

            .tags {
                margin-left: .3rem;
                display: flex;
                flex-grow: 1;
                align-items: center;

                .hero-tag {
                    margin-right: .5em;
                    text-wrap: none;
                    white-space: nowrap;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: .25rem;

                    + .badge-tags-wrap {
                        margin-left: 0;
                    }
                }

                .badge-tags-wrap {
                    display: inline-block;
                    text-wrap: none;
                    white-space: nowrap;
                    margin-left: .8em;
                }
            }

            .text-guide-part-content {
                flex-direction: column;
                justify-content: center;
                text-align: left;
                font-size: 1em;
                white-space: nowrap;
                overflow: hidden;
                margin: 1em;
                flex-grow: 999;
                font-family: $body-font;
                height: 2em;
                //& > *:not() {
                //
                //}
                & ::v-deep .markdown {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                & ::v-deep * {
                    margin: 0;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

            .unclickable {
                pointer-events: none;
                display: flex;
                flex-direction: row;
                height: $training-goal-height;
                width: $training-goal-height/9*16;

                .aspect-ratio-box {
                    width: $training-goal-height/9*16;
                }
            }
        }
    }

    .uncollapsed {
        display: flex;
        flex-direction: column;

        & > * {
            flex-basis: 100%;
        }

        button {
            min-height: 4rem;
            font-size: 2rem;

            & ::v-deep .background {
                border-radius: 0 !important;
            }
        }
    }

}

</style>
