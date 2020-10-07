<template>
    <div class="modal-popup">
        <ModalBackground
                v-hammer:tap="()=>$emit('close')"
        />
        <Popup
        >
            <slot></slot>
        </Popup>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Popup from "@/vue/general/Popup.vue";
import ModalBackground from "@/vue/general/ModalBackground.vue";

@Component({
    components: {Popup, ModalBackground},
})
export default class ModalPopup extends Vue {
};

</script>

<style lang="scss" scoped>
.modal-popup {
    position: fixed;
    z-index: 200;
}
</style>
