import axios from 'axios'

/**
 *
 * @param {axios} axios
 * @param {string} rootUrl
 * @constructor
 */
function Backend(axios, rootUrl) {
    this.axios = axios;
    this.rootUrl = rootUrl;
}

Backend.prototype.evaluatePick = async function (pick) {
    return await this.axios.post(this.rootUrl + '/evaluate-pick', pick.forRequest(), {})
        .then(response => {
            return response.data;
        });
};
export default Backend;