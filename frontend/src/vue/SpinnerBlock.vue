<template>
    <div class="spinner-block">
        <Spinner/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import Spinner from "@/vue/Spinner.vue";

@Component({
    components: {
        Spinner,
    },
})
export default class SpinnerBlock extends Vue {
};

</script>

<style scoped>
.spinner-block {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>
