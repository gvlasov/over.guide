<template>
    <OverwatchPanelButton
            type="main"
            class="install-pwa-button"
            v-hammer:tap="promptInstall"
    >
        <font-awesome-icon icon="plus"/>
        Add to home screen
    </OverwatchPanelButton>
</template>

<script lang="ts">

import OverwatchPanelButton from "./OverwatchPanelButton.vue";
import Component, {mixins} from "vue-class-component";
import {VuePwaInstallMixin} from "vue-pwa-install";

@Component({
    components: {
        OverwatchPanelButton,
    },
})
export default class InstallPwaButton extends mixins(VuePwaInstallMixin) {

    promptInstall() {
        this.event().prompt()
    }

    event() {
        return (window as any).deferredPrompt
    }

    get isAlreadyInstalled(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches
    }

    created() {
        if (this.isAlreadyInstalled) {
            // alert('installed')
        } else {
            // alert('not installed')
        }
    }

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
