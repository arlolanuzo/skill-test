const { ERROR_MESSAGES } = require("./error-messages");
const API_HOST = "ip-check-api.vercel.app";
const API_SUB_URL = "ipcheck-encrypted";
const SAMPLE_API_KEY = "757532143557";
const API_HEADERS = {
    "x-secret-header": "secret",
};
const API_URL = `https://${API_HOST}/api/${API_SUB_URL}/${SAMPLE_API_KEY}`;

// validation constants
const POSTGRES_INTEGER_MAX = 2147483647;
const REGEX_CLASS_NAME = /^[a-zA-Z0-9 .-]+$/; // Allows letters, numbers, spaces, dots, and hyphens
const REGEX_NAME = /^[a-zA-Z0-9 .'-]+$/; // Allows letters, numbers, spaces, dots, hyphens, and apostrophes
const REGEX_PHONE_NUMBER = /^\+?[0-9-]+$/; // Allows optional '+' at the start, followed by digits and hyphens

module.exports = {
    ERROR_MESSAGES,
    SAMPLE_API_KEY,
    API_SUB_URL,
    API_HOST,
    API_HEADERS,
    API_URL,
    POSTGRES_INTEGER_MAX,
    REGEX_CLASS_NAME,
    REGEX_NAME,
    REGEX_PHONE_NUMBER,
};
