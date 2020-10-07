<template>
    <transition
            name="modal-appear"
            appear
    >
        <div class="modal-background"></div>
    </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class ModalBackground extends Vue {
};

</script>

<style lang="scss" scoped>

.modal-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 199;
    top: 0;
    left: 0;
    background-color: hsl(0, 0%, 0%, .5);
}

.modal-appear-enter {
    opacity: 0;
}

.modal-appear-enter-to {
    opacity: 1;
}

.modal-appear-enter-active {
    transition: opacity .2s ease-out;
}
</style>
