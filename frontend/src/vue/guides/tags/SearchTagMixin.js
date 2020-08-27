import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";

export default {
    methods: {
        searchTag(descriptor) {
            const newPath = "/search/"
                + new DescriptorParamUnparser().unparseDescriptor(descriptor);
            this.$router.push(newPath)
        }
    },
};
