<template>
    <OverwatchPanelButton type="default">
        <slot/>
        <img
                v-if="open"
                src="/icons/arrow-down-white.svg"
        />
        <img
                v-if="!open"
                src="/icons/arrow-up-white.svg"
        />
    </OverwatchPanelButton>
</template>

<script>
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";

export default {
    props: {
        open: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        OverwatchPanelButton,
    }
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
        background-color: hsla(55, 80%, 50%, .6);
    }

}
</style>
