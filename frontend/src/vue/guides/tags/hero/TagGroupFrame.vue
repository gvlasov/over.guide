<template>
    <span class="tag-type-group-wrap">
        <span class="tag-type-infix"
              v-bind:class="{'infix-ally': gamerPosition.isAlly, 'infix-enemy' : gamerPosition.isEnemy}"
        >
            <slot name="infix"/>
        </span>
        <slot name="frame-content"/>
    </span>
</template>

<script>
    import GamerPositionVso from "@/js/vso/GamerPositionVso";

    export default {
        props: {
            gamerPosition: {
                type: GamerPositionVso,
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

<style scoped>

    .tag-type-group-wrap {
        display: inline-table;
        border-spacing: 0;
    }

    .tag-type-infix {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        color: black;
        padding: 0 0 0 0;
    }

    .infix-ally, .infix-enemy {
        width: 1.5em;
    }
</style>