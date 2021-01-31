<template>
    <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Authentication from "@/ts/Authentication";

@Component({
    components: {},
})
export default class SiteResetPage extends Vue {

    mounted() {
        Authentication.instance
            .removeAuthCookies();
        localStorage.clear()
        fetch(process.env.BACKEND_BASE_URL + '/fixture/load-default')
            .then(() => {
                this.$router.push('/search')
            })
    }

}

</script>

<style lang="scss" scoped>
</style>
