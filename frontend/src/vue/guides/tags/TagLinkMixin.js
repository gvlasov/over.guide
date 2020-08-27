import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";

export default {
    methods: {
        goToTagLink(descriptor, basePath = '/search/') {
            const newPath = basePath
                + new DescriptorParamUnparser().unparseDescriptor(descriptor);
            this.$router.push(newPath)
        }
    },
};
