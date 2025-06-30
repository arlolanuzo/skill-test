// src/services/sessionService.js
const { redisClient } = require("../../config/redis");
const { env } = require("../../config");

/**
 * Stores token in Redis.
 * @param {string} userId
 * @returns {string} refreshToken
 */
const cacheRefreshToken = async ({ userId, refreshToken }) => {
    const key = `session:${userId}:${refreshToken}`;
    const sessionData = {
        userId,
        createdAt: Date.now(),
    };

    await redisClient.set(key, JSON.stringify(sessionData), {
        expiration: {
            type: "EX",
            value: env.JWT_REFRESH_TOKEN_TIME_IN_MS / 1000,
        },
    });

    return refreshToken;
};

module.exports = {
    cacheRefreshToken,
};
