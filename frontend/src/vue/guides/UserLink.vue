<template>
    <router-link class="user-link" :to="`/user/${user.id}`">{{ user.name }}</router-link>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import UserVso from "@/ts/vso/UserVso";
import Vue from 'vue'

@Component({})
export default class UserLink extends Vue {

    @Prop({required: true})
    user: UserVso

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/fonts.scss";

a {
    @include overwatch-futura;
    color: white;
    text-decoration: none;
    font-size: 1.15em;

    &:hover {
        text-decoration: underline;
    }
    &:visited {
        color: white;
    }
}
</style>
