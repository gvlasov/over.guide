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

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import Backend from "@/ts/Backend";
import axios from 'axios';
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import TrainingGoalWidget from "@/ts/vso/TrainingGoalWidget";
import GuidePreviewBadge from "@/vue/guides/GuidePreviewBadge";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

const backend = new Backend(axios);

@Component({
    components: {
        GuidePreviewBadge,
        OverwatchButton,
    },
})
export default class TrainingGoal extends Vue {
    @Prop({required: true})
    trainingGoal: TrainingGoalWidget

    removeTrainingGoal() {
        MyTrainingGoalsCache.instance()
            .removeGoal(this.trainingGoal.guide.guideId)
            .then(() => {
                this.trainingGoal.deleted = true;
            })
    }

    readdTrainingGoal() {
        this.trainingGoal.deleted = false;
        this.$emit('removeUndo', this.trainingGoal.guide.guideId)
    }
};

</script>

<style lang="scss" scoped>
.button {
    flex-basis: 5em;
    font-size: 1rem;
    flex-shrink: 0;
}

</style>
