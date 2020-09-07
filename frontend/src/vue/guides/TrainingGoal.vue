<template>
    <div class="wrap">
        <div
                v-if="trainingGoal.open"
                class="uncollapsed"
        >
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => {$emit('close');}"
            >Close
            </OverwatchButton>
            <Guide
                    :guide="trainingGoal.guide"
                    :show-training-goal-button="false"
                    :search-descriptor="null"
            />
        </div>
        <div
                v-else
                class="collapsed"
                v-bind:class="{deleted: trainingGoal.deleted}"
        >
            <div
                    class="opacity"
                    v-hammer:tap="() => {$emit('open')}"
            >
                <div class="tags">
                    <Tag
                            v-if="trainingGoal.guide.descriptor.hasHeroes"
                            class="hero-tag"
                            :descriptor="trainingGoal.guide.descriptor"
                    />
                    <div ref="badgeTagsWrap" class="badge-tags-wrap">
                        <ThematicTagBadge
                                v-for="thematicTag in trainingGoal.guide.descriptor.thematicTags"
                                ref="thematicTags"
                                :tag="thematicTag"
                                :key="thematicTag.dataName"
                        />
                        <ThematicTagBadge
                                v-for="map in trainingGoal.guide.descriptor.maps"
                                ref="mapTags"
                                :tag="map"
                                :key="map.dataName"
                        />
                    </div>
                </div>
                <GuidePartText
                        v-if="typeof firstTextWidget !== 'undefined'"
                        :part="firstTextWidget.part"
                />
                <div class="unclickable">
                    <AspectRatioBox>
                        <YoutubeVideo
                                v-if="typeof firstVideoWidget !== 'undefined'"
                                :video-id="firstVideoWidget.part.excerpt.youtubeVideoId"
                                :start="firstVideoWidget.part.excerpt.startSeconds"
                                :end="firstVideoWidget.part.excerpt.endSeconds"
                                :loop="true"
                                :autoplay="false"
                                :mute="true"
                                :player-element-id="'training-goal-' + trainingGoal.guide.guideId + '-' + trainingGoal.order + '-' + firstVideoWidget.part.excerpt.youtubeVideoId"
                                class="video"
                                :enable-controls="false"
                        />
                    </AspectRatioBox>
                </div>
            </div>
            <OverwatchButton
                    v-if="!trainingGoal.deleted"
                    type="default"
                    v-hammer:tap="removeTrainingGoal"
                    class="remove-button button"
            >Remove
            </OverwatchButton>
            <OverwatchButton
                    v-else
                    type="default"
                    v-hammer:tap="readdTrainingGoal"
                    class="undo-button button"
            >Undo
            </OverwatchButton>
        </div>
    </div>
</template>

<script>
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/js/Backend";
import axios from 'axios';
import Tag from "@/vue/guides/tags/hero/Tag";
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import MyTrainingGoalsCache from "@/js/MyTrainingGoalsCache";
import TrainingGoalWidget from "@/js/vso/TrainingGoalWidget";
import Guide from "@/vue/guides/Guide";
import AspectRatioBox from "@/vue/AspectRatioBox";
import GuidePartText from "@/vue/guides/GuidePartText";

const backend = new Backend(axios);

export default {
    model: {},
    props: {
        trainingGoal: {
            type: TrainingGoalWidget,
            required: true
        },
    },
    methods: {
        removeTrainingGoal() {
            MyTrainingGoalsCache.instance()
                .removeGoal(this.trainingGoal.guide.guideId)
                .then(() => {
                    this.trainingGoal.deleted = true;
                })
        },
        readdTrainingGoal() {
            this.trainingGoal.deleted = false;
            this.$emit('removeUndo', this.trainingGoal.guide.guideId)
        }
    },
    computed: {
        firstVideoWidget() {
            return this.trainingGoal.guide.parts.find(widget => widget.part.kind === 'video')

        },
        firstTextWidget() {
            return this.trainingGoal.guide.parts.find(widget => widget.part.kind === 'text')
        },
    },
    mounted() {
    },
    data() {
        return {
        }
    },
    components: {
        GuidePartText,
        AspectRatioBox,
        Guide,
        ThematicTagBadge,
        Tag,
        OverwatchButton,
        YoutubeVideo,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.wrap {
    $training-goal-height: 4em;
    @include overwatch-futura-no-smallcaps;
    color: white;
    --left-border-radius: .6rem;
    box-sizing: border-box;

    .collapsed {
        display: flex;
        min-height: $training-goal-height;
        cursor: pointer;
        box-shadow: $overwatch-panel-bg-shadow;
        border-radius: var(--left-border-radius) 0 0 var(--left-border-radius);
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

    .deleted {
        box-shadow: 0 .1em .3em rgba($overwatch-panel-bg-color, .5);

        .opacity {
            opacity: .3;
        }
    }

    .opacity {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        @include overwatch-panel-bg;
        border-radius: var(--left-border-radius) 0 0 var(--left-border-radius);

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
                gap: .25rem
            }

            .badge-tags-wrap {
                display: inline-block;
                text-wrap: none;
                white-space: nowrap;
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
            height:2em;
            //& > *:not() {
            //
            //}

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

    .button {
        flex-basis: 5em;
        font-size: 1rem;
        flex-shrink: 0;
    }
}

</style>
