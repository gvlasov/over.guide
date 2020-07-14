<template>
    <TagGroupFrame>
        <template slot="infix">
            <slot name="infix"/>
        </template>
        <template slot="frame-content">
            <TagGroupBackground
                    v-if="heroes.length > 0"
                    class="tag-type-links-wrap-player tappable-background"
                    v-hammer:tap="() => (selecting = groupName)"
            >
                <TagPortrait
                        v-for="hero in heroes"
                        :key="hero.dataName"
                        :hero="hero"
                />
            </TagGroupBackground>
            <TagGroupInvite
                    v-hammer:tap=""
                    v-else
            >Player
            </TagGroupInvite>
        </template>
    </TagGroupFrame>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait";
    import TagGroupFrame from "@/vue/guide-tags/hero/TagGroupFrame";
    import TagGroupInvite from "@/vue/guide-tags/hero/TagGroupInvite";

    export default {
        props: {
            heroes: {
                type: Array,
                required: true,
            },
            groupName: {
                type: String,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            TagGroupInvite,
            HeroPortrait,
            TagGroupFrame,
        },
    };

</script>

<style scoped>
    .portrait {
        width: 3em;
        vertical-align: middle;
        background-color: #28253a;
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }
</style>
