<template>
    <LoginNotice>
        <div class="notice">
            <slot name="notice"/>
        </div>
        <OverwatchButton
                type="default"
                class="login-button"
        >
            <BattlenetAuthButton
                    v-hammer:tap="saveRedirectPath"
            />
        </OverwatchButton>
        <div class="notice subnotice">
            <slot name="subnotice"/>
        </div>
        <OverwatchButton
                type="default"
                class="close-button"
                v-hammer:tap="() => $emit('back')"
        >Back
        </OverwatchButton>
    </LoginNotice>
</template>

<script>
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import OverwatchButton from "@/vue/OverwatchButton";
import LoginNotice from "@/vue/LoginNotice";

export default {
    props: {},
    methods: {
        saveRedirectPath() {
            localStorage.setItem('pathBeforeBnetAuth', this.$route.path)
        }
    },
    computed: {},
    components: {
        LoginNotice,
        OverwatchButton,
        BattlenetAuthButton,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.notice {
    font-size: 1.1em;
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
</style>
