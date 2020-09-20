<template>
    <a v-bind:href="url" class="battle-net-button" title="Battle.net auth">
        <div>
            <div style="position: relative; display: inline-block; vertical-align: middle">
                <img src="/icons/battlenet.svg"/>
            </div>
            Log in
        </div>
    </a>
</template>

<script lang="ts">
import env from '../env/dev'
import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class BattlenetAuthButton extends Vue {

    redirectUri: string = env.BATTLE_NET_REDIRECT_URI
    clientId: string = env.BATTLE_NET_CLIENT_ID

    get url(): string {
        return 'https://eu.battle.net/oauth/authorize?access_type=online&client_id='
            + this.clientId
            + '&redirect_uri='
            + encodeURI(this.redirectUri)
            + '&response_type=code&state=';
    }
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.battle-net-button {
    @include overwatch-futura;
    text-decoration: none;
    display: block;
    background-size: 1em 1em;
    height: 100%;

    img {
        height: 1em;
        position: absolute;
        transform: translate(-80%, -50%);
    }
}
</style>
