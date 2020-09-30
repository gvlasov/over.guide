<template>
    <div class="training-goal-buttons">
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

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()
const auth = new Authentication();
const backend = new Backend(axios)

@Component({
    components: {
        TrainingGoalButton,
        GuideContent,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
    },
})
export default class TrainingGoalToggle extends Vue {
    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    cache: MyTrainingGoalsCache = myTrainingGoalsCache

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

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.training-goal-buttons {
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
