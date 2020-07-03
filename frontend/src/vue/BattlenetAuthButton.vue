<template>
    <a v-bind:href="url" class="battle-net-button" title="Battle.net auth"></a>
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

<style scoped>
    .battle-net-button {
        background-image: url("/icons/battlenet.svg");
        background-size: 7vw 7vw;
        display: inline-block;
        width: 7vw;
        height: 7vw;
    }
</style>
