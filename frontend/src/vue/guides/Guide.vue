<template>
    <div class="wrap">
        <div class="meta">
            <div
                    class="tags"
                    v-hammer:tap="searchTag"
            >
                <Tag class="hero-tag" :descriptor="guide.descriptor"/>
                <div ref="badgeTagsWrap" class="badge-tags-wrap">
                    <ThematicTagBadge
                            v-for="thematicTag in guide.descriptor.thematicTags"
                            ref="thematicTags"
                            :tag="thematicTag"
                            :key="thematicTag.dataName"
                    />
                    <ThematicTagBadge
                            v-for="map in guide.descriptor.maps"
                            ref="mapTags"
                            :tag="map"
                            :key="map.dataName"
                    />
                </div>
            </div>
            <div class="authorship">
                <div class="creation-date" v-bind:title="absoluteDateText()">{{creationTimeRelative()}} ago</div>
                <div class="author">by
                    <a v-bind:href="`/#/user/${guide.author.id}`">{{guide.author.name}}</a>
                </div>
            </div>
        </div>
        <div
                v-if="showTrainingGoalButton"
                class="training-goal-buttons"
        >
            <OverwatchButton
                    v-if="trainingGoalAdded"
                    type="main"
                    class="training-goal-button remove-training-goal-button"
                    v-hammer:tap="removeTrainingGoal"
            >Your training goal
            </OverwatchButton>
            <OverwatchButton
                    v-else
                    type="default"
                    class="training-goal-button add-training-goal-button"
                    v-hammer:tap="addTrainingGoal"
            >Add training goal
            </OverwatchButton>
        </div>
        <div v-for="(part, index) in guide.parts" :key="index" class="guide-part">
            <div class="text-guide-part" v-if="part.part.kind === 'text'">
                <div
                        class="text-guide-part-content"
                        v-html="part.render()"
                ></div>
            </div>
            <div v-if="part.part.kind === 'video'">
                <YoutubeVideo
                        :video-id="part.part.excerpt.youtubeVideoId"
                        :start="part.part.excerpt.startSeconds"
                        :end="part.part.excerpt.endSeconds"
                        :loop="true"
                        :autoplay="false"
                        :mute="true"
                        :player-element-id="guide.guideId + '-' + index +'-'+ part.part.excerpt.youtubeVideoId"
                        class="video"
                        v-bind:style="{width: '100%', height: '22rem'}"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
    import OverwatchButton from "@/vue/OverwatchButton";
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
    import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
    import GuideVso from "@/js/vso/GuideVso";
    import Tag from "@/vue/guides/tags/hero/Tag";
    import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
    import formatDistance from 'date-fns/formatDistance'
    import TopicComments from "@/vue/TopicComments";
    import CommentsCounter from "@/vue/CommentsCounter";
    import MyTrainingGoalsCache from "@/js/MyTrainingGoalsCache";
    import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";

    const backend = new Backend(axios);
    const myTrainingGoalsCache = new MyTrainingGoalsCache(backend);
    export default {
        model: {},
        props: {
            guide: {
                type: GuideVso,
                required: true
            },
            showTrainingGoalButton: {
                type: Boolean,
                default: true,
            }
        },
        methods: {
            renderTextPart(part) {
                return new GuidePartTextWidget(part).render()
            },
            creationTimeRelative() {
                return formatDistance(new Date(this.guide.createdAt), new Date());
            },
            absoluteDateText() {
                return new Date(this.guide.createdAt).toLocaleString();
            },
            addTrainingGoal() {
                myTrainingGoalsCache.addGoal(this.guide.guideId)
                this.$forceUpdate();
            },
            removeTrainingGoal() {
                myTrainingGoalsCache.removeGoal(this.guide.guideId)
                this.$forceUpdate();
            },
            searchTag() {
                const newPath = "/search/"
                    + new DescriptorParamUnparser().unparseDescriptor(this.guide.descriptor);
                this.$router.push(newPath)
            }
        },
        data() {
            return {
                goalIds: myTrainingGoalsCache.goalIds,
                trainingGoalButtonHover: false,
            }
        },
        computed: {
            trainingGoalAdded() {
                return this.goalIds.includes(this.guide.guideId);
            },
        },
        mounted() {
        },
        components: {
            ThematicTagBadge,
            Tag,
            DescriptorBuilder,
            OverwatchButton,
            YoutubeVideo,
            TopicComments,
            CommentsCounter,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.css';
    @import '~@/assets/css/overwatch-ui.scss';

    .wrap {
        @include overwatch-panel;
        display: inline-block;
        box-sizing: border-box;
        color: white;
        padding: 1em;
    }

    .meta {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        color: white;
        justify-content: space-between;
        margin: .3em;
    }

    .tags {
        text-align: left;
        cursor: pointer;

        &:hover {
            background-color: rgba(white, .4);
            box-shadow: 0 0 .4rem white;
        }
    }

    a {
        font-family: 'BigNoodleTooOblique', 'sans-serif';
        color: #2991de;
    }

    .guide-part {
        cursor: pointer;
        box-sizing: border-box;
        /*background-color: rgba(43, 55, 83, 0.8);*/
        color: white;
        position: relative;
    }

    .text-guide-part {
        max-width: 100%;
        font-family: "Proxima Nova Light", sans-serif;
    }

    .text-guide-part ::v-deep img {
        max-width: 100%;
    }

    .text-guide-part-content {
        text-align: left;
        pointer-events: none;
        font-size: 1.5em;
        word-break: break-word;
    }

    .video {
        max-width: 100%;
        width: 100%;
    }

    .descriptor-builder {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        /* For it to be positioned above everything else,
               which is important when the dropdown is displayed
               */
    }

    .hero-tag {
        display: inline-block;
        margin-right: .5em;
    }

    .badge-tags-wrap {
        display: inline-block;
    }

    .authorship {
        white-space: nowrap;
        @include overwatch-futura-no-smallcaps;

        a {
            color: #8bbafe;
        }
    }

    .training-goal-buttons {
        text-align: right;
        margin-bottom: 1rem;

        .training-goal-button {
            font-size: 1.5rem;
        }

        $training-goal-color: rgb(0, 255, 196);

        .remove-training-goal-button {

            &:hover {
                @include overwatch-button-hover;
            }

            & ::v-deep .background {
                background-color: $training-goal-color;
            }

            &:hover ::v-deep .background {
                background-color: $training-goal-color;
            }
        }
    }

</style>
