<template>
    <div class="private-label">private</div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from 'vue'


@Component({
    components: {},
})
export default class PrivateLabel extends Vue {

};

</script>

<style lang="scss" scoped>
.private-label {
    $private-color: hsl(170, 0, 35%);
    font-family: "Futura Demi Bold", sans-serif;
    letter-spacing: .07em;
    font-size: .85em;
    background-color: rgba($private-color, .6);
    display: inline-block;
    border-radius: .3em;
    box-shadow: 0 0 .13em #000;
    padding: .55em 2em;
    line-height: .9em;
}
</style>
