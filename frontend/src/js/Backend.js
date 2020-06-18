import Alternative from "./dto/Alternative";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluation from "./dto/MatchupEvaluation";

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
/**
 * @param {Hero} subject
 * @param {Hero} object
 * @returns {Promise<MatchupEvaluation>}
 */
Backend.prototype.evaluateMatchup = async function (subject, object) {
    return await this.axios.post(
        this.rootUrl + '/matchup-evaluation',
        {
            subject: subject.dataName,
            object: object.dataName
        },
        {}
    )
        .then(response => new MatchupEvaluation(response.data));
};
/**
 * @param {string} videoId
 * @param {number} startSeconds
 * @param {number} endSeconds
 * @returns {Promise<number|null>}
 */
Backend.prototype.saveVideoExcerpt = async function (videoId, startSeconds, endSeconds) {
    return await this.axios.post(
        this.rootUrl + '/youtube-video-excerpt',
        {
            videoId: videoId,
            startSeconds: startSeconds,
            endSeconds: endSeconds,
        },
        {}
    )
        .then((response) => {
            if (response.status === 201) {
                return response.data.id;
            } else {
                return null;
            }
        });
};
export default Backend;