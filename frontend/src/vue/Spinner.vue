<template>
    <div class="spinner"
         v-bind:style="{backgroundPositionX: this.shiftPx+'px'}"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class Spinner extends Vue {

    interval = null
    shiftPx = 0;

    created() {
        this.interval = setInterval(
            () => {
                this.shiftPx += 40;
                if (this.shiftPx > 21 * 40) {
                    this.shiftPx = 0
                }
            },
            1000/40
        )
    }

    destroyed() {
        clearInterval(this.interval)
    }
};

</script>

<style scoped>
.spinner {
    background-image: url('/icons/spinner-sprite-modified.png');
    width: 40px;
    height: 40px;
    opacity: .5;
}
</style>
