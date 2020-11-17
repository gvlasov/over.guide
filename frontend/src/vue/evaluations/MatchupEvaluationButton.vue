<template>
    <OverwatchPanelButton
            type="default"
            v-bind:class="`matchup-${classSuffix}`"
    >
        <slot/>
    </OverwatchPanelButton>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";

@Component({
    components: {
        OverwatchPanelButton,
    }
})
export default class MatchupEvaluationButton extends Vue {

    @Prop({required: true})
    classSuffix: string

}

</script>

<style lang="scss" scoped>
.matchup-hard-countered, .matchup-hard-countered:disabled {
    &::v-deep .background {
        background-color: hsl(0, 69%, 44%);
    }
}

.matchup-countered, .matchup-countered:disabled {
    & ::v-deep .background {
        background-color: hsl(0, 49%, 59%);
    }
}

.matchup-ok, .matchup-ok:disabled {
    & ::v-deep .background {
        background-color: hsl(36, 32%, 64%);
    }
}

.matchup-counters, .matchup-counters:disabled {
    & ::v-deep .background {
        background-color: hsl(170, 59%, 42%);
    }
}

.matchup-hard-counters, .matchup-hard-counters:disabled {
    & ::v-deep .background {
        background-color: hsl(180, 76%, 45%);
    }
}

</style>
