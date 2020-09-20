<template>
    <OverwatchPanelButton type="default">
        <slot/>
        <img
                v-if="open && $el && !$el.getAttribute('disabled')"
                src="/icons/arrow-up-white.svg"
        />
        <img
                v-if="!open && $el && !$el.getAttribute('disabled')"
                src="/icons/arrow-down-white.svg"
        />
    </OverwatchPanelButton>
</template>

<script lang="ts">
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        OverwatchPanelButton,
    }
})
export default class OverwatchDropdownButton extends Vue {
    @Prop({required: true})
    open: boolean
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.overwatch-button {
    @include overwatch-futura;
    width: 100%;
    font-weight: normal;
    font-size: 1.3rem;
    text-align: center;

    &:disabled ::v-deep .background {
        background-color: transparent;
        pointer-events: none;
    }

    &:disabled ::v-deep img {
        img {
            display: none;
        }
    }

    img {
        height: 1em;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 1em;
    }

    & ::v-deep .background {
        background-color: hsla(35, 100%, 50%, .7);
    }

}
</style>
