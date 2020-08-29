<template>
    <span class="tag-type-group-wrap">
        <div class="tag-type-infix"
             v-bind:class="{'infix-ally': tagGroup.gamerPosition.isAlly, 'infix-enemy' : tagGroup.gamerPosition.isEnemy}"
        >
            <slot name="infix"/>
        </div>
        <slot name="frame-content"/>
    </span>
</template>

<script>
import TagGroupVso from "@/js/vso/TagGroupVso";

export default {
        props: {
            tagGroup: {
                type: TagGroupVso,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {},
    };
</script>

<style lang="scss" scoped>

    .tag-type-group-wrap {
        display: inline-table;
        border-spacing: 0;
    }

    .tag-type-infix {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        color: hsl(220, 30%, 30%);
        padding: 0 0 0 0;
    }

    $infix-width: 1.5em;
    $infix-ally-font-size: 1.4em;

    .infix-ally, .infix-enemy {
        min-width: $infix-width;
    }

    .infix-ally {
        font-size: $infix-ally-font-size;
        min-width: #{$infix-width/$infix-ally-font-size}em;
    }
</style>