<template>
    <portal to="modal">
        <slot name="background">
            <ModalBackground
                    v-hammer:tap="()=>$emit('close')"
            />
        </slot>
        <slot name="popup">
            <Popup>
                <slot></slot>
            </Popup>
        </slot>
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
.popup {
    box-shadow: 0 1em 2.5em hsla(30, 10%, 20%, 1);
}
</style>
