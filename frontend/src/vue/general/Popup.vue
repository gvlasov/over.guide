<template>
    <transition
            name="popup"
            appear
    >
        <div class="popup">
            <slot/>
        </div>
    </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class Popup extends Vue {
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/common.scss";

.popup {
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    z-index: 200;
    box-sizing: border-box;
}

.popup-enter {
    margin-top: 1em;
    opacity: 0;
}

.popup-enter-to {
    margin-top: 0;
    opacity: 1;
}

.popup-enter-active {
    transition: margin-top .2s ease-in, opacity .2s ease-out;
}
</style>
