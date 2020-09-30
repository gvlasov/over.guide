<template>
    <OverwatchButton
            :type="type"
            class="training-goal-button"
    >
        <slot/>
    </OverwatchButton>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'

@Component({
    components: {
        OverwatchButton,
    },
})
export default class TrainingGoalButton extends Vue {
    @Prop({required: true})
    type: string

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.training-goal-button {
    font-size: 1.5rem;
}

</style>
