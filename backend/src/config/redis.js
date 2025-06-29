const { createClient } = require("redis");
const { env } = require("./env");

const redisClient = createClient({
    url: env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("error", (err) => console.error("Redis Error", err));

redisClient.connect();

module.exports = { redisClient };
