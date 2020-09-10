<template>
    <div class="guide">
        <div class="meta">
            <div
                    class="tags"
                    v-hammer:tap="() => $router.push(tagLink(guide.descriptor)).catch(()=>{})"
                    v-bind:class="{'same-as-search': guide.descriptor.equals(searchDescriptor)}"
            >
                <Tag
                        class="hero-tag"
                        :descriptor="guide.descriptor"
                        v-if="guide.descriptor.hasHeroes"
                />
                <TagBadges ref="badgeTagsWrap" :descriptor="guide.descriptor"/>
            </div>
            <div class="authorship">
                <div class="creation-date" v-bind:title="absoluteDateText()">{{ creationTimeRelative() }} ago</div>
                <div class="author">by
                    <a v-bind:href="`/#/user/${guide.author.id}`">{{ guide.author.name }}</a>
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
        <div v-for="(widget, index) in guide.parts" :key="index" class="guide-part">
            <div class="text-guide-part" v-if="widget.part.kind === 'text'">
                <GuidePartText :part="widget.part"/>
            </div>
            <AspectRatioBox v-if="widget.part.kind === 'video'">
                <VideoLoadingScreen/>
                <YoutubeVideo
                        :video-id="widget.part.excerpt.youtubeVideoId"
                        :start="widget.part.excerpt.startSeconds"
                        :end="widget.part.excerpt.endSeconds"
                        :loop="true"
                        :autoplay="false"
                        :mute="true"
                        :player-element-id="guide.guideId + '-' + index +'-'+ widget.part.excerpt.youtubeVideoId"
                        class="video"
                />
            </AspectRatioBox>
        </div>
        <OverwatchButton
                v-if="canEdit && isStored"
                type="default"
                v-hammer:tap="edit"
        >Edit</OverwatchButton>
        <OverwatchButton
                v-if="canEdit && isStored"
                type="default"
                v-hammer:tap="deactivate"
        >Delete</OverwatchButton>
    </div>
</template>

<script>
import YoutubeVideo from "@/vue/videos/YoutubeVideo.vue";
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
import GuideVso from "@/js/vso/GuideVso";
import Tag from "@/vue/guides/tags/hero/Tag";
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import formatDistance from 'date-fns/formatDistance'
import TopicComments from "@/vue/TopicComments";
import CommentsCounter from "@/vue/CommentsCounter";
import MyTrainingGoalsCache from "@/js/MyTrainingGoalsCache";
import AspectRatioBox from "@/vue/AspectRatioBox";
import VideoLoadingScreen from "@/vue/VideoLoadingScreen";
import TagBadges from "@/vue/guides/TagBadges";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import TagLinkMixin from "@/vue/guides/tags/TagLinkMixin";
import GuidePartText from "@/vue/guides/GuidePartText";
import Authentication from "@/js/Authentication";
import axios from 'axios'
import Backend from "@/js/Backend";

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()
const auth = new Authentication();
const backend = new Backend(axios)

export default {
    mixins: [
        TagLinkMixin,
    ],
    model: {},
    props: {
        guide: {
            type: GuideVso,
            required: true
        },
        showTrainingGoalButton: {
            type: Boolean,
            default: true,
        },
        searchDescriptor: {
            validator: prop => prop instanceof GuideDescriptorVso || prop === null,
            required: true,
        },
    },
    methods: {
        edit() {
            this.$router.push(`/guide-editor/${this.guide.guideId}`)
        },
        deactivate() {
            backend.deactivateGuide(this.guide.guideId)
                .then(() => {
                    this.$emit('guideDeactivated', this.guide.guideId)
                })
        },
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
            this.cache.addGoal(this.guide.guideId)
        },
        removeTrainingGoal() {
            const hadItPending  = this.cache.pendingGoalIds.includes(this.guide.guideId)
            this.cache.removeGoal(this.guide.guideId)
                .catch(() => {
                    if (!hadItPending) {
                        this.$emit('loginRequired')
                    }
                })
        },
    },
    data() {
        return {
            trainingGoalButtonHover: false,
            cache: myTrainingGoalsCache,
        }
    },
    computed: {
        trainingGoalAdded() {
            return this.cache.goalIds.includes(this.guide.guideId) || this.cache.pendingGoalIds.includes(this.guide.guideId);
        },
        canEdit() {
            return auth.canEditGuide(this.guide)
        },
        isStored() {
            return this.guide.guideId !== undefined;
        }
    },
    mounted() {
    },
    components: {
        GuidePartText,
        TagBadges,
        VideoLoadingScreen,
        AspectRatioBox,
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
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.guide {
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
    margin: .3em 0 .3em 0;
}

.tags {
    display: flex;
    gap: .5em;
    align-items: center;
    text-align: left;
    cursor: pointer;
    padding-left: 0;
    transition: padding-left .13s;

    &:hover {
        padding-left: 1em;
        transition: padding-left .13s;
    }

    .hero-tag {
        display: inline-block;
    }

}

.tags.same-as-search:hover {
    transform: translateX(0) rotateY(0deg);
    transition: transform .13s ease-in-out !important;
}

.tags.same-as-search:active {
    transform: rotate3d(1, 0, 0, 90deg);
    transition: transform .13s step-start !important;
}

a {
    font-family: 'BigNoodleTooOblique', 'sans-serif';
    color: white;
    font-size: 1.3em;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.guide-part {
    box-sizing: border-box;
    /*background-color: rgba(43, 55, 83, 0.8);*/
    color: white;
    position: relative;
}

.text-guide-part {
    max-width: 100%;
    font-family: $body-font;
}

.text-guide-part-content {
    text-align: left;
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

.authorship {
    white-space: nowrap;
    @include overwatch-futura-no-smallcaps;
}

.training-goal-buttons {
    text-align: right;
    margin-bottom: 1rem;

    .training-goal-button {
        font-size: 1.5rem;
    }

    $training-goal-color: #edad4c;

    .remove-training-goal-button {

        @include overwatch-inline-button;

        & ::v-deep .background {
            background-color: $training-goal-color;
        }

        &:hover ::v-deep .background {
            background-color: $training-goal-color;
        }
    }
}

</style>
