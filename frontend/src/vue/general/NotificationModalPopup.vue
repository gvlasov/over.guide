<template>
    <ModalPopup
            class="notification-modal-popup"
            @close="() => $emit('close')"
    >
        <slot name="background" slot="background"/>
        <Popup slot="popup">
            <slot name="default" slot="default"/>
        </Popup>
    </ModalPopup>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ModalPopup from "@/vue/general/ModalPopup.vue";
import Popup from "@/vue/general/Popup.vue";

@Component({
    components: {
        Popup,
        ModalPopup,
    },
})
export default class NotificationModalPopup extends Vue {

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/common.scss";
$width: 40rem;
.popup {
    min-height: 2em;
    box-shadow: 0 1em 2.5em hsla(30, 10%, 20%, 1);
    max-width: native-min($width, 100vw);
    min-width: native-min($width, 100vw);
}
</style>
