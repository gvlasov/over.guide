<template>
    <div class="login-notice">
        <div class="notice">
            <slot name="notice"/>
        </div>
        <OverwatchButton
                type="default"
                class="login-button"
                v-hammer:tap="saveRedirectPath"
        >
            <BattlenetAuthButton
                    ref="battle-net-auth-button"
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
    </div>
</template>

<script lang="ts">
import BattlenetAuthButton from "@/vue/BattlenetAuthButton";
import OverwatchButton from "@/vue/OverwatchButton";
import LoginNotice from "@/vue/LoginNotice";
import Vue from 'vue'
import Component from "vue-class-component";
import {Ref} from "vue-property-decorator";

@Component({
    components: {
        LoginNotice,
        OverwatchButton,
        BattlenetAuthButton,
    },
})
export default class LoginRequirement extends Vue {
    @Ref('battle-net-auth-button') bnetButton

    declare $route: any

    saveRedirectPath() {
        localStorage.setItem('pathBeforeBnetAuth', this.$route.path)
        window.location.href = this.bnetButton.url
    }
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.login-notice {
    background-color: hsla(250, 30%, 31%, 0.80);
    font-size: 1.1em;
    @include overwatch-futura;
    padding: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    &.subnotice {
        font-size: .8em;
        margin-bottom: 1.6rem;
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
