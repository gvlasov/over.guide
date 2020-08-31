<template>
    <span class="tag-type-group-wrap">
        <div class="tag-type-infix"
             v-bind:class="{'infix-teammate': tagGroup.gamerPosition.isTeammate, 'infix-enemy' : tagGroup.gamerPosition.isEnemy}"
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
    $infix-teammate-font-size: 1.4em;

    .infix-teammate, .infix-enemy {
        min-width: $infix-width;
    }

    .infix-teammate {
        font-size: $infix-teammate-font-size;
        min-width: #{$infix-width/$infix-teammate-font-size}em;
    }
</style>