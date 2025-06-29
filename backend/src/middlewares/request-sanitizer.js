const { sanitizeRequest } = require("../utils/sanitize-request");

/**
 * Middleware to sanitize input from request body, query, and params.
 *
 * @param {Object} req - The request object.
 * @param {Function} next - The next middleware function.
 */
const requestSanitizer = (req, _, next) => {
    if (req.body) {
        req.body = sanitizeRequest(req.body);
    }
    if (req.query) {
        req.query = sanitizeRequest(req.query);
    }
    if (req.params) {
        req.params = sanitizeRequest(req.params);
    }

    next();
};

module.exports = {
    requestSanitizer,
};
