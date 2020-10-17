<template>
    <span class="relative-time" v-bind:title="absoluteDateText()">{{ creationTimeRelative() }} ago</span>
</template>

<script lang="ts">
import formatDistance from 'date-fns/formatDistance'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'


@Component({
    components: {
    },
})
export default class RelativeTime extends Vue {
    @Prop({required: true})
    time: Date

    declare $router: any


    creationTimeRelative(): string {
        return formatDistance(this.time, new Date());
    }

    absoluteDateText(): string {
        return this.time.toLocaleString();
    }

};

</script>

<style lang="scss" scoped>
.relative-time {
    display: inline;
}
</style>
