<template>
    <div class="guide-buttons">
        <LinkLikeButton
                :disabled="!auth.loggedIn"
                v-hammer:tap="() => creatingReport = !creatingReport"
        >report</LinkLikeButton>
        <ModalPopup
                v-if="creatingReport"
                @close="() =>  creatingReport = false"
        >
            <ReportCreator
                    :post-id="entry.guideId"
                    :post-type-id="PostTypeId.Guide"
                    :post-type-name="'guide'"
                    :reasons="reasons"
                    @close="() => creatingReport = false"
            />
        </ModalPopup>
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
        <TrainingGoalButton
                v-if="trainingGoalAdded"
                type="main"
                class="remove-training-goal-button"
                v-hammer:tap="removeTrainingGoal"
        >Your training goal
        </TrainingGoalButton>
        <TrainingGoalButton
                v-else
                type="default"
                class="add-training-goal-button"
                v-hammer:tap="addTrainingGoal"
        >Add training goal
        </TrainingGoalButton>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import GuidePartText from "@/vue/guides/GuidePartText";
import Authentication from "@/ts/Authentication";
import axios from 'axios'
import Backend from "@/ts/Backend";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'
import GuideContent from "@/vue/guides/GuideContent.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import TrainingGoalButton from "@/vue/guides/TrainingGoalButton.vue";
import ReportCreator from "@/vue/guides/ReportCreator.vue";
import PostTypeId from "data/PostTypeId";
import ReportReasonDto from "data/dto/ReportReasonDto";
import reportReasons from 'data/reportReasons'
import ModalPopup from "@/vue/general/ModalPopup.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()
const auth = new Authentication();
const backend = new Backend(axios)

@Component({
    components: {
        LinkLikeButton,
        ModalPopup,
        ReportCreator,
        TrainingGoalButton,
        GuideContent,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
    },
})
export default class GuideButtons extends Vue {

    PostTypeId = PostTypeId

    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    creatingReport: boolean = false

    cache: MyTrainingGoalsCache = myTrainingGoalsCache

    auth: Authentication = auth

    reasons: ReportReasonDto[] = Array.from(reportReasons.values())

    addTrainingGoal(): void {
        this.cache.addGoal(this.entry.guideId)
    }

    removeTrainingGoal() {
        const hadItPending = this.cache.pendingGoalIds.includes(this.entry.guideId)
        this.cache.removeGoal(this.entry.guideId)
            .catch(() => {
                if (!hadItPending) {
                    this.$emit('loginRequired')
                }
            })
    }

    get trainingGoalAdded(): boolean {
        return this.cache.goalIds.includes(this.entry.guideId) || this.cache.pendingGoalIds.includes(this.entry.guideId);
    }

    edit() {
        this.$router.push(`/guide-editor/${this.entry.guideId}`)
    }

    async deactivate(): Promise<void> {
        return backend.deactivateGuide(this.entry.guideId)
            .then(() => {
                this.$emit('guideDeactivated', this.entry.guideId)
            })
    }

    get canEdit(): boolean {
        return auth.canEditGuide(this.entry)
    }

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.guide-buttons {
    text-align: right;
    margin-bottom: 1rem;

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
