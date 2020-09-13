<template>
    <GuidePreviewBadge
            :guide="trainingGoal.guide"
            :ghost="trainingGoal.deleted"
            :open="trainingGoal.open"
            :order="trainingGoal.order"
            @close="$emit('close')"
            @open="$emit('open')"
    >
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
    </GuidePreviewBadge>
</template>

<script>
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/js/Backend";
import axios from 'axios';
import MyTrainingGoalsCache from "@/js/MyTrainingGoalsCache";
import TrainingGoalWidget from "@/js/vso/TrainingGoalWidget";
import GuidePreviewBadge from "@/vue/guides/GuidePreviewBadge";

const backend = new Backend(axios);

export default {
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
    data() {
        return {}
    },
    components: {
        GuidePreviewBadge,
        OverwatchButton,
    },
};

</script>

<style lang="scss" scoped>
.button {
    flex-basis: 5em;
    font-size: 1rem;
    flex-shrink: 0;
}

</style>
