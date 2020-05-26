import Alternative from "./dto/Alternative";
import PickEvaluation from "./PickEvaluation";

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
 * @param {Pick} pick
 * @returns {Promise<PickEvaluation>}
 */
Backend.prototype.evaluatePick = async function (pick) {
    return await this.axios.post(this.rootUrl + '/evaluate-pick', pick.forRequest(), {})
        .then(response => {
                return new PickEvaluation(
                    response.data.alternatives.map(data => new Alternative(data))
                );
            }
        )
        ;
};
export default Backend;