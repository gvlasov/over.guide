import Alternative from "./dto/Alternative";
import PickSuggestion from "./PickSuggestion";

/**
 *
 * @param {AxiosStatic} axios
 * @param {string} rootUrl
 * @constructor
 */
function Backend(axios, rootUrl) {
    this.axios = axios;
    this.rootUrl = rootUrl;
}

/**
 * @param {PickContext} context
 * @returns {Promise<PickSuggestion>}
 */
Backend.prototype.suggestPick = async function (context) {
    return await this.axios.post(this.rootUrl + '/suggest-pick', context.forRequest(), {})
        .then(response => {
            return new PickSuggestion(
                    response.data.alternatives.map(data => new Alternative(data))
                );
            }
        );
};
export default Backend;