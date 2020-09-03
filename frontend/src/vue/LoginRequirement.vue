<template>
    <div class="login-requirement">
        <div class="notice">
            <slot name="notice"/>
        </div>
        <OverwatchButton
                type="default"
                class="login-button"
        >
            <BattlenetAuthButton/>
        </OverwatchButton>
        <div class="notice subnotice">
            <slot name="subnotice"/>
        </div>
        <OverwatchButton
                type="default"
                class="close-button"
                v-hammer:tap="() => $emit('back')"
        >Close
        </OverwatchButton>
    </div>
</template>

<script>
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import OverwatchButton from "@/vue/OverwatchButton";

export default {
    props: {},
    computed: {},
    components: {
        OverwatchButton,
        BattlenetAuthButton,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

$width: 40rem;
.login-requirement {
    left: 50%;
    top: 50%;
    @include overwatch-panel;
    transform: translate(-50%, -50%);
    position: fixed;
    z-index: 200;
    max-width: $width;
    min-width: $width;
    background-color: hsla(250, 30%, 31%, 0.97);
    box-sizing: border-box;
    padding: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 1.5rem;

    .notice {
        font-size: 1.1em;
        color: white;
        @include overwatch-futura;
        &.subnotice {
            font-size: .8em;
            margin-bottom: 1.6rem;
        }
    }

    .login-button {
        margin: 3rem 0 2rem 0;
        font-size: 2em;
    }

    .close-button {
        font-size: 1.2em;
    }
}
</style>
