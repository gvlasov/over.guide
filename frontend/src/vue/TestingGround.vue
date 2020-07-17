<template>
    <div class="wrap">
        <!--        <div>Tag:</div>-->
        <!--        <div>-->
        <!--            <Tag :guide-hero-tag="tag"/>-->
        <!--        </div>-->
        <!--        <div>Tag builder:</div>-->
        <!--        <div>-->
        <!--            <TagBuilder :guide-hero-tag="tag"/>-->
        <!--        </div>-->
        <div>
            <DescriptorBuilder
                    @search="onSearch"
            />
        </div>
    </div>
</template>

<script>
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import Topic from "@/js/Topic";
    import heroes from "data/heroes";
    import TagBuilder from "@/vue/guides/tags/hero/TagBuilder";
    import Tag from "@/vue/guides/tags/hero/Tag";
    import ThematicTagInput from "@/vue/guides/ThematicTagInput";
    import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";

    const backend = new Backend(axios);

    export default {
        props: {},
        methods: {
            onSearch($event) {
                console.log($event);
            }
        },
        data() {
            const subject = heroes.get('pharah');
            const object = heroes.get('mei');
            return {
                subject: subject,
                object: object,
                topic: new Topic([subject, object]),
                tag: {
                    playerHeroes: [heroes.get('pharah')],
                    allyHeroes: [heroes.get('lucio'), heroes.get('ana')],
                    enemyHeroes: [heroes.get('doomfist'), heroes.get('mei')],
                },
            };
        },
        components: {
            Tag,
            TagBuilder,
            ThematicTagInput,
            DescriptorBuilder,
        },
    };

</script>

<style scoped>
    .wrap {
    }
</style>
