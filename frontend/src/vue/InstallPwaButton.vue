<template>
    <OverwatchPanelButton
            type="main"
            class="install-pwa-button"
            v-hammer:tap="() => A2HS.instance.installEvent.prompt()"
    >
        <slot>
            Add to home screen
        </slot>
    </OverwatchPanelButton>
</template>

<script lang="ts">

import OverwatchPanelButton from "./OverwatchPanelButton.vue";
import Component from "vue-class-component";
import A2HS from "@/ts/A2HS";
import Vue from 'vue'

@Component({
    components: {
        OverwatchPanelButton,
    },
})
export default class InstallPwaButton extends Vue {

    A2HS = A2HS

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.install-pwa-button {
    & ::v-deep .content {
        padding: .5em;
        display: flex;
        align-items: center;
        gap: .5em;

    }

    svg {
        vertical-align: middle;
    }
}
</style>
