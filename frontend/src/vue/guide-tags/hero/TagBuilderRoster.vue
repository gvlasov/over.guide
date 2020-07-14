<template>
    <div>
        <Roster
                @selectedHeroesChange="emitChange"
                :selected-heroes="selectedHeroes"
        />

        <button
                class="overwatch-main-button"
                v-hammer:tap="onTap"
        >Save
        </button>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guide-tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guide-tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guide-tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guide-tags/hero/TagGroupInvite";
    import Roster from "@/vue/Roster";


    export default {
        model: {
            prop: 'selectedHeroes',
            event: 'selectedHeroesChange',
        },
        props: {
            selectedHeroes: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                selecting: null,
            };
        },
        methods: {
            emitChange($event) {
                this.$emit('selectedHeroesChange', $event);
            },
            onTap() {
                this.$emit('save');
            },
        },
        computed: {},
        components: {
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
            Roster,
        },
    };

</script>

<style scoped>
    .wrap {
    }

    .tag-type-links-wrap-player {
        background-color: rgba(75, 125, 217, 0.9);
    }

    .tag-type-links-wrap-ally {
        background-color: rgba(15, 213, 71, 0.9);
    }

    .tag-type-links-wrap-enemy {
        background-color: rgba(229, 34, 34, 0.9);
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

    .tappable-background {
        cursor: pointer;
    }

</style>
