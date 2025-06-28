// students-mapping.js

// Mapping array for student fields
const mapping = [
    ["id", "id"],
    ["name", "name"],
    ["email", "email"],
    ["gender", "gender"],
    ["dob", "dob"],
    ["phone", "phone"],
    ["current_address", "currentAddress"],
    ["admission_date", "admissionDate"],
    ["class_name", "class"],
    ["section_name", "section"],
    ["roll", "roll"],
    ["father_name", "fatherName"],
    ["father_phone", "fatherPhone"],
    ["mother_name", "motherName"],
    ["mother_phone", "motherPhone"],
    ["guardian_name", "guardianName"],
    ["guardian_phone", "guardianPhone"],
    ["relation_of_guardian", "relationOfGuardian"],
    ["permanent_address", "permanentAddress"],
    ["system_access", "systemAccess"],
];

function toInternalFields(obj) {
    const result = {};
    mapping.forEach(([external, internal]) => {
        if (obj[external] !== undefined) {
            result[internal] = obj[external];
        }
    });
    return result;
}

function toExternalFields(obj) {
    const result = {};
    mapping.forEach(([external, internal]) => {
        if (obj[internal] !== undefined) {
            result[external] = obj[internal];
        }
    });
    return result;
}

module.exports = {
    toInternalFields,
    toExternalFields,
};
