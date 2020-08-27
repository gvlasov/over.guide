import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";

const unparser = new DescriptorParamUnparser();
export default {
    methods: {
        tagLink(descriptor, basePath = '/search/') {
            return basePath + unparser.unparseDescriptor(descriptor);
        }
    },
};
