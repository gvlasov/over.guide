<template>
    <Popup class="login-notice">
        <slot/>
    </Popup>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Popup from "@/vue/Popup.vue";

@Component({
    components: {
        Popup,
    },
})
export default class LoginNotice extends Vue {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

$width: 40rem;
.login-notice {
    @include overwatch-panel;
    background-color: hsla(250, 30%, 31%, 0.97);
    padding: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 1.5rem;
}
</style>
