<template>
    <ModalPopup>
        <slot/>
    </ModalPopup>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Popup from "@/vue/general/Popup.vue";
import ModalPopup from "@/vue/general/ModalPopup.vue";

@Component({
    components: {
        ModalPopup,
        Popup,
    },
})
export default class LoginNotice extends Vue {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.login-notice ::v-deep .popup {
    @include overwatch-panel;
    font-size: 1.5rem;
}
</style>
