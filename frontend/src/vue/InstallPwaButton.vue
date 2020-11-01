<template>
    <OverwatchPanelButton
            type="main"
            class="install-pwa-button"
            v-hammer:tap="() => A2HS.instance.installEvent.prompt()"
    >
        <font-awesome-icon icon="plus"/>
        Add to home screen
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
        padding: .3em;
    }

    svg {
        vertical-align: middle;
    }
}
</style>
