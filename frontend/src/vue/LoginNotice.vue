<template>
    <transition
            name="login-notice-appear"
            appear
    >
        <div class="login-notice">
            <slot/>
        </div>
    </transition>
</template>

<script>
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import OverwatchButton from "@/vue/OverwatchButton";

export default {
    props: {},
    methods: {
        asdf() {
            alert('start')
        }
    },
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
.login-notice {
    text-align: center;
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

}


.login-notice-appear-enter {
    margin-top: 1em;
    opacity: 0;
}

.login-notice-appear-enter-to {
    margin-top: 0;
    opacity: 1;
}

.login-notice-appear-enter-active {
    transition: margin-top .2s ease-in, opacity .2s ease-out;
}
</style>
