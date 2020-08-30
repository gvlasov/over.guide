<template>
    <a v-bind:href="url" class="battle-net-button" title="Battle.net auth">
        <div>
            <img src="/icons/battlenet.svg"/>
            Log in
        </div>
    </a>
</template>

<script>
import env from '../env/dev'

export default {
    props: {},
    methods: {},
    computed: {
        url() {
            return 'https://eu.battle.net/oauth/authorize?access_type=online&client_id='
                + this.clientId
                + '&redirect_uri='
                + encodeURI(this.redirectUri)
                + '&response_type=code&state=';
        }
    },
    data() {
        return {
            redirectUri: env.BATTLE_NET_REDIRECT_URI,
            clientId: env.BATTLE_NET_CLIENT_ID,
        }
    },
    components: {},
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.battle-net-button {
    @include overwatch-futura;
    color: white;
    text-decoration: none;
    display: block;
    background-size: 1em 1em;
    height: 100%;

    img {
        height: 1em;
        vertical-align: middle;
    }
}
</style>
