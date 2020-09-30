<template>
    <div class="guide">
        <GuideMeta
                :entry="head.entry"
                :search-descriptor="searchDescriptor"
                :creation-time="creationTime"
        />
        <TrainingGoalToggle
                :entry="head.entry"
        />
        <GuideContent
                :entry="head.entry"
        />
        <OverwatchButton
                v-if="canEdit"
                type="default"
                v-hammer:tap="edit"
        >Edit
        </OverwatchButton>
        <OverwatchButton
                v-if="canEdit"
                type="default"
                v-hammer:tap="deactivate"
        >Delete
        </OverwatchButton>
        <div class="comments">
            <CommentsSection
                    v-if="showCommentsSection"
                    :post="head"
                    @close="() => showCommentsSection = false"
            />
            <CommentsButton
                    v-else
                    :comments-count="head.commentsCount"
                    v-hammer:tap="() => showCommentsSection = !showCommentsSection"
            />
        </div>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePartText from "@/vue/guides/GuidePartText";
import Authentication from "@/ts/Authentication";
import axios from 'axios'
import Backend from "@/ts/Backend";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import GuideMeta from "@/vue/guides/GuideMeta.vue";
import Vue from 'vue'
import GuideContent from "@/vue/guides/GuideContent.vue";
import TrainingGoalToggle from "@/vue/guides/TrainingGoalToggle.vue";
import CommentsButton from "@/vue/guides/CommentsButton.vue";
import CommentsSection from "@/vue/comments/CommentsSection.vue";

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()
const auth = new Authentication();
const backend = new Backend(axios)

@Component({
    components: {
        CommentsSection,
        CommentsButton,
        TrainingGoalToggle,
        GuideContent,
        GuideMeta,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
    },
})
export default class Guide extends Vue {
    @Prop({required: true})
    head: ExistingGuideHeadVso

    @Prop()
    searchDescriptor: GuideDescriptorVso | null

    declare $router: any

    showCommentsSection: boolean = false

    trainingGoalButtonHover: boolean = false
    cache: MyTrainingGoalsCache = myTrainingGoalsCache

    edit() {
        this.$router.push(`/guide-editor/${this.head.entry.guideId}`)
    }

    async deactivate(): Promise<void> {
        return backend.deactivateGuide(this.head.entry.guideId)
            .then(() => {
                this.$emit('guideDeactivated', this.head.entry.guideId)
            })
    }

    addTrainingGoal(): void {
        this.cache.addGoal(this.head.entry.guideId)
    }

    removeTrainingGoal() {
        const hadItPending = this.cache.pendingGoalIds.includes(this.head.entry.guideId)
        this.cache.removeGoal(this.head.entry.guideId)
            .catch(() => {
                if (!hadItPending) {
                    this.$emit('loginRequired')
                }
            })
    }

    get trainingGoalAdded(): boolean {
        return this.cache.goalIds.includes(this.head.entry.guideId) || this.cache.pendingGoalIds.includes(this.head.entry.guideId);
    }

    get canEdit(): boolean {
        return auth.canEditGuide(this.head)
    }

    get creationTime(): Date {
        return new Date(this.head.entry.createdAt)
    }

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

    .descriptor-builder {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        /* For it to be positioned above everything else,
               which is important when the dropdown is displayed
               */
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
    .comments {
        text-align: right;
        button {
            font-size: 1.5em;
        }
    }
}

</style>
