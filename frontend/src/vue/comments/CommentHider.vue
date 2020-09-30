<template>
    <div class="hider">
        <div class="strip"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class CommentHider extends Vue {

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
.hider {
    padding: 0 1em;
    cursor: pointer;
    flex-grow: 1;

    .strip {
        border-left: 1px solid rgba(255, 255, 255, .4);
        min-width: 1px;
        min-height: 100%;
    }

    &:hover .strip {
        border-color: $overwatch-button-main-bg-color;
    }
}
</style>
