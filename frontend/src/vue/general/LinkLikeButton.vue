<template>
    <button class="link-like-button"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class LinkLikeButton extends Vue {
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
button {
    font-size: 1em;
    color: white;
    cursor: pointer;
    @include overwatch-futura;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
    background-color: transparent;
    border: 0;
    padding-bottom: .2em;
}
</style>
