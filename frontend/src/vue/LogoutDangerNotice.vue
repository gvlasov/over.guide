<template>
    <LoginNotice>
        <div>This will log you out from
            <strong>every</strong> site that uses this Battle.net account
        </div>
        <div class="buttons">
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('back')"
            >Cancel
            </OverwatchButton>
            <OverwatchButton
                    type="main"
                    v-hammer:tap="() => $emit('confirm')"
            >Log me out
            </OverwatchButton>
        </div>
    </LoginNotice>
</template>

<script>
import OverwatchButton from "@/vue/OverwatchButton";
import LoginNotice from "@/vue/LoginNotice";

export default {
    components: {
        LoginNotice,
        OverwatchButton,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.buttons {
    margin-top: 2em;
}

</style>
