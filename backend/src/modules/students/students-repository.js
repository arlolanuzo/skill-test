const { processDBRequest } = require("../../utils");

const getRoleId = async (roleName) => {
    const query = "SELECT id FROM roles WHERE name ILIKE $1";
    const queryParams = [roleName];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0].id;
};

const findAllStudents = async (payload) => {
    const {
        name,
        className,
        sectionName,
        roll,
        search,
        page = 1,
        limit = 10,
    } = payload;
    let query = `
        SELECT
            t1.id,
            t1.name,
            t1.email,
            t1.last_login AS "lastLogin",
            t1.is_active AS "systemAccess",
            t3.user_id AS "userId",
            t3.gender,
            t3.dob,
            t3.phone,
            t3.class_name AS "className",
            t3.section_name AS "sectionName",
            t3.roll,
            t3.admission_dt AS "admissionDate",
            t3.father_name AS "fatherName",
            t3.father_phone AS "fatherPhone",
            t3.mother_name AS "motherName",
            t3.mother_phone AS "motherPhone",
            t3.guardian_name AS "guardianName",
            t3.guardian_phone AS "guardianPhone",
            t3.relation_of_guardian AS "relationOfGuardian",
            t3.current_address AS "currentAddress",
            t3.permanent_address AS "permanentAddress",
            t3.created_dt AS "createdDt",
            t3.updated_dt AS "updatedDt"
        FROM users t1
        LEFT JOIN user_profiles t3 ON t1.id = t3.user_id
        WHERE t1.role_id = 3`;
    let queryParams = [];
    if (search) {
        query += ` AND (t1.name ILIKE $${queryParams.length + 1} OR t1.email ILIKE $${queryParams.length + 2})`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (name) {
        query += ` AND t1.name = $${queryParams.length + 1}`;
        queryParams.push(name);
    }
    if (className) {
        query += ` AND t3.class_name = $${queryParams.length + 1}`;
        queryParams.push(className);
    }
    if (sectionName) {
        query += ` AND t3.section_name = $${queryParams.length + 1}`;
        queryParams.push(sectionName);
    }
    if (roll) {
        query += ` AND t3.roll = $${queryParams.length + 1}`;
        queryParams.push(roll);
    }

    query += " ORDER BY t1.id";

    const offset = (page - 1) * limit;
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const { rows } = await processDBRequest({ query, queryParams });
    return rows;
};

const addOrUpdateStudent = async (payload) => {
    try {
        const query = "SELECT * FROM student_add_update($1)";
        const queryParams = [payload];
        const { rows } = await processDBRequest({ query, queryParams });
        return rows[0];
    } catch (error) {
        throw error;
    }
};

const findStudentDetail = async (id) => {
    const query = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.is_active AS "systemAccess",
            p.phone,
            p.gender,
            p.dob,
            p.class_name AS "class",
            p.section_name AS "section",
            p.roll,
            p.father_name AS "fatherName",
            p.father_phone AS "fatherPhone",
            p.mother_name AS "motherName",
            p.mother_phone AS "motherPhone",
            p.guardian_name AS "guardianName",
            p.guardian_phone AS "guardianPhone",
            p.relation_of_guardian as "relationOfGuardian",
            p.current_address AS "currentAddress",
            p.permanent_address AS "permanentAddress",
            p.admission_dt AS "admissionDate",
            r.name as "reporterName"
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        LEFT JOIN users r ON u.reporter_id = r.id
        WHERE u.id = $1`;
    const queryParams = [id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
};

const findStudentToSetStatus = async ({ userId, reviewerId, status }) => {
    const now = new Date();
    const query = `
        UPDATE users
        SET
            is_active = $1,
            status_last_reviewed_dt = $2,
            status_last_reviewer_id = $3
        WHERE id = $4
    `;
    const queryParams = [status, now, reviewerId, userId];
    const { rowCount } = await processDBRequest({ query, queryParams });
    return rowCount;
};

const findStudentToUpdate = async (payload) => {
    const {
        basicDetails: { name, email },
        id,
    } = payload;
    const currentDate = new Date();
    const query = `
        UPDATE users
        SET name = $1, email = $2, updated_dt = $3
        WHERE id = $4;
    `;
    const queryParams = [name, email, currentDate, id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows;
};

module.exports = {
    getRoleId,
    findAllStudents,
    addOrUpdateStudent,
    findStudentDetail,
    findStudentToSetStatus,
    findStudentToUpdate,
};
