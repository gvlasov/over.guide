<template>
    <div id='remark42'></div>
</template>

<script>
    import Topic from "../js/Topic";

    export default {
        props: {
            topic: Topic
        },
        methods: {},
        mounted() {
            window.remark_config = {
                host: "https://localhost:8443",
                site_id: 'overwatch_compendium',
                url: this.topic.toString(),
                components: ['embed'],
                max_shown_comments: 15,
                theme: 'dark',
                page_title: this.topic.toString(),
                locale: 'en',
            };

            (function (c) {
                for (var i = 0; i < c.length; i++) {
                    var d = document, s = d.createElement('script');
                    s.src = remark_config.host + '/web/' + c[i] + '.js';
                    s.defer = true;
                    (d.head || d.body).appendChild(s);
                }
            })(remark_config.components || ['embed']);
        },
        data() {
            return {};
        },
        components: {},
    };

</script>

<style scoped>
</style>
