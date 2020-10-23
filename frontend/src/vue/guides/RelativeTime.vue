<template>
    <span class="relative-time" v-bind:title="absoluteDateText()">{{ creationTimeRelative() }} ago</span>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'
import {formatDistanceToNowStrict} from "date-fns";


@Component({
    components: {
    },
})
export default class RelativeTime extends Vue {
    @Prop({required: true})
    time: Date

    declare $router: any


    creationTimeRelative(): string {
        return formatDistanceToNowStrict(this.time);
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
