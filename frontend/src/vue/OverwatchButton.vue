<template>
    <button
            class="overwatch-button"
            v-bind:class="'overwatch-'+type+'-button'"
    >
        <div class="background"></div>
        <div class="content">
            <slot></slot>
        </div>
    </button>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({})
export default class OverwatchButton extends Vue {
    @Prop({required: true})
    type: string
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/fonts.scss";
@import "~@/assets/css/overwatch-ui.scss";

.overwatch-button {
    @include overwatch-inline-button;
    background-color: rgba($transparent-button-mount-bg-color, .5);
    z-index: 1;
    &:disabled {
        background-color: transparent;
    }
}

.overwatch-button > .content {
    position: relative;
    overflow: hidden;
    padding: .05em 1.07em .19em 1.07em;
}

button {
    outline: 0;
    font-size: 2rem;

    &[disabled] {
        pointer-events: none;

        & ::v-deep .background {
            background-color: hsla(0, 0%, 20%, .3) !important;
        }

        & ::v-deep .content {
            color: hsla(0, 0, 100%, 1)
        }
    }
}

.overwatch-main-button > .background {
    @include overwatch-button-bg-main;
}

.overwatch-default-button > .background {
    @include overwatch-button-bg-default;
}
</style>
