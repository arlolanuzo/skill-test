const xss = require("xss");

/**
 * Sanitizes input to prevent XSS attacks.
 * It recursively sanitizes strings, arrays, and objects.
 * @param {String} input
 * @returns {String|Array|Object|null}
 */
const sanitizeRequest = (input) => {
    if (!input) {
        return input;
    }

    if (typeof input === "string") {
        return xss(input);
    }

    if (Array.isArray(input)) {
        return input.map(sanitizeRequest);
    }

    if (typeof input === "object") {
        for (const key in input) {
            input[key] = sanitizeRequest(input[key]);
        }
    }

    return input;
};

module.exports = {
    sanitizeRequest,
};
