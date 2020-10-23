<template>
    <portal to="modal">
        <ModalBackground
                v-hammer:tap="()=>$emit('close')"
        />
        <Popup>
            <slot></slot>
        </Popup>
    </portal>
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

    mounted() {
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Escape') {
                this.$emit('close')
            }
        })
    }
};

</script>

<style lang="scss" scoped>
.modal-popup {
    position: fixed;
    z-index: 200;
}
</style>
