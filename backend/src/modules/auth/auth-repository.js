const { db } = require("../../config");
const { redisClient } = require("../../config/redis");
const { processDBRequest } = require("../../utils");

const findUserByUsername = async (username, client) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await client.query(query, [username]);
    return rows[0];
};

const invalidateCachedRefreshToken = async (userId, refreshToken) => {
    return await redisClient.del(`session:${userId}:${refreshToken}`);
};

const findCachedRefreshToken = async (userId, refreshToken) => {
    const sessionData = await redisClient.get(
        `session:${userId}:${refreshToken}`
    );
    if (sessionData) {
        return JSON.parse(sessionData);
    }
    return null;
};

const getMenusByRoleId = async (roleId, client) => {
    const isUserAdmin = Number(roleId) === 1 ? true : false;
    const query = isUserAdmin
        ? `SELECT * FROM access_controls`
        : `
            SELECT
                ac.id,
                ac.name,
                ac.path,
                ac.icon,
                ac.parent_path,
                ac.hierarchy_id,
                ac.type
            FROM permissions p
            JOIN access_controls ac ON p.access_control_id = ac.id
            WHERE p.role_id = $1
        `;
    const queryParams = isUserAdmin ? [] : [roleId];
    const { rows } = await client.query(query, queryParams);
    return rows;
};

const getRoleNameByRoleId = async (id, client = db) => {
    const query = "SELECT lower(name) AS name from roles WHERE id = $1";
    const queryParams = [id];
    const { rows } = await client.query(query, queryParams);
    return rows[0].name;
};

const saveUserLastLoginDate = async (userId, client) => {
    const now = new Date();
    const query = `UPDATE users SET last_login = $1 WHERE id = $2`;
    const queryParams = [now, userId];
    await client.query(query, queryParams);
};

const destroyOldCachedRefreshTokenByUserId = async (userId) => {
    return await redisClient.del(`session:${userId}:*`);
};

const isEmailVerified = async (id) => {
    const query = "SELECT is_email_verified FROM users WHERE id = $1";
    const queryParams = [id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0].is_email_verified;
};

const verifyAccountEmail = async (id) => {
    const query = `
        UPDATE users
        SET is_email_verified = true
        WHERE id = $1
        RETURNING *
    `;
    const queryParams = [id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
};

const doesEmailExist = async (id, email) => {
    const query = `SELECT email FROM users WHERE email = $1 AND id = $2`;
    const queryParams = [email, id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
};

const setupUserPassword = async (payload) => {
    const { userId, userEmail, password } = payload;
    const query = `
        UPDATE users
        SET password = $1, is_active = true
        WHERE id = $2 AND email = $3
    `;
    const queryParams = [password, userId, userEmail];
    const { rowCount } = await processDBRequest({ query, queryParams });
    return rowCount;
};

module.exports = {
    findUserByUsername,
    invalidateCachedRefreshToken,
    findCachedRefreshToken,
    getMenusByRoleId,
    getRoleNameByRoleId,
    saveUserLastLoginDate,
    destroyOldCachedRefreshTokenByUserId,
    isEmailVerified,
    verifyAccountEmail,
    doesEmailExist,
    setupUserPassword,
};
