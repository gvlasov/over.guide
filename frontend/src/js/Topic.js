/**
 * @constructor
 */
import Hero from "./Hero";

function Topic(parts) {
    this.parts = parts;
}

Topic.prototype.toString = function () {
    return this.parts
        .map(part => {
            if (part instanceof Hero) {
                return 'hero-' + part.dataName
            } else {
                if (typeof part !== 'object') {
                    throw new Error(
                        'Parts must be supported objects, part ' + part + ' is ' + (typeof part)
                    )
                }
                throw new Error(
                    'Unsupported part ' + part.constructor.name
                )
            }
        })
        .join('_')
};
export default Topic;
