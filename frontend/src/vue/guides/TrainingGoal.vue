<template>
    <div class="wrap">
        <div
                class="opacity"
                v-bind:class="{deleted: trainingGoal.deleted}"
        >
            <div class="tags">
                <Tag class="hero-tag" :descriptor="trainingGoal.guide.descriptor"/>
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
            <div
                    v-if="typeof firstTextPart !== 'undefined'"
                    class="text-guide-part-content"
                    v-html="firstTextPart.render()"
            ></div>
            <YoutubeVideo
                    v-if="typeof firstVideoWidget !== 'undefined'"
                    :video-id="firstVideoWidget.part.excerpt.youtubeVideoId"
                    :start="firstVideoWidget.part.excerpt.startSeconds"
                    :end="firstVideoWidget.part.excerpt.endSeconds"
                    :loop="true"
                    :autoplay="false"
                    :mute="true"
                    :player-element-id="'training-goal-' + trainingGoal.guide.guideId + '-' + firstVideoWidget.part.excerpt.youtubeVideoId"
                    class="video"
                    v-bind:style="{width: '7em', height: '4em'}"
            />
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

    const backend = new Backend(axios);

    export default {
        model: {},
        props: {
            trainingGoal: {
                type: TrainingGoalWidget,
                required: true
            }
        },
        methods: {
            removeTrainingGoal() {
                (new MyTrainingGoalsCache(backend))
                    .removeGoal(this.trainingGoal.guide.guideId)
                    .then(() => {
                        this.trainingGoal.deleted = true;
                    })
            },
            readdTrainingGoal() {
                (new MyTrainingGoalsCache(backend))
                    .addGoal(this.trainingGoal.guide.guideId, this.trainingGoal.order)
                    .then(() => {
                        this.trainingGoal.deleted = false;
                    })
            }
        },
        computed: {
            firstVideoWidget() {
                return this.trainingGoal.guide.parts.find(p => p.isVideo())

            },
            firstTextPart() {
                return this.trainingGoal.guide.parts.find(p => p.isText())
            },
        },
        mounted() {
        },
        data() {
            return {}
        },
        components: {
            ThematicTagBadge,
            Tag,
            OverwatchButton,
            YoutubeVideo,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.css';
    @import '~@/assets/css/overwatch-ui.scss';

    .wrap {
        display: flex;
        background-color: rgba(43, 55, 83, 0.8);
        @include overwatch-futura-no-smallcaps;
        color: white;
        max-height: 4em;
        min-height: 4em;

        .opacity {
            flex-grow: 1;
            display: flex;
            overflow: hidden;

            .tags {
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
                }

                .badge-tags-wrap {
                    display: inline-block;
                    text-wrap: none;
                    white-space: nowrap;
                }
            }

            .text-guide-part-content {
                display: block;
                text-align: left;
                font-size: 1em;
                white-space: nowrap;
                overflow: hidden;
                padding: 1em;
                flex-grow: 999;

                & ::v-deep * {
                    margin: 0;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }

        .button {
            flex-basis: 5em;
            flex-shrink: 0;
        }
    }

    .deleted {
        opacity: .3;
    }

</style>
