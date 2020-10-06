<template>
    <span class="tag-group-frame">
        <div class="tag-type-infix"
             v-bind:class="{'infix-teammate': tagGroup.gamerPosition.isTeammate, 'infix-enemy' : tagGroup.gamerPosition.isEnemy}"
        >
            <slot name="infix"/>
        </div>
        <slot name="frame-content"/>
    </span>
</template>

<script lang="ts">
import TagGroupVso from "@/ts/vso/TagGroupVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class TagGroupFrame extends Vue {
    @Prop({required: true})
    tagGroup: TagGroupVso
};
</script>

<style lang="scss" scoped>

.tag-group-frame {
    display: inline-table;
    border-spacing: 0;

    .tag-type-infix {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        color: hsl(220, 30%, 30%);
        padding: 0 0 0 0;
    }

    $infix-width: 1.5em;
    $infix-teammate-font-size: 1.4em;

    .infix-teammate, .infix-enemy {
        min-width: $infix-width;
    }

    .infix-teammate {
        font-size: $infix-teammate-font-size;
        min-width: #{$infix-width/$infix-teammate-font-size}em;
    }
}
</style>