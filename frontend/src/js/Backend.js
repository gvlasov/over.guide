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

Backend.prototype.evaluatePick = function (pick) {
    this.axios.post(this.rootUrl + '/evaluate-pick', pick.forRequest(), {})
        .then(response => {
            console.log(response);
        });
};
export default Backend;