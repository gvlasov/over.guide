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
export default class StorageResetPage extends Vue {

    mounted() {
        Authentication.instance
            .removeAuthCookies();
        localStorage.clear()
        this.$router.push('/')
    }

}

</script>

<style lang="scss" scoped>
</style>
