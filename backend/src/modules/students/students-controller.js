const asyncHandler = require("express-async-handler");
const {
    getAllStudents,
    addNewStudent,
    getStudentDetail,
    setStudentStatus,
    updateStudent,
} = require("./students-service");
const { toInternalFields, toExternalFields } = require("./students-mapping");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const {
        name,
        class_name: className,
        section_name: sectionName,
        roll,
        search,
        page = 1,
        limit = 10,
    } = req.query;

    const students = await getAllStudents({
        name,
        className,
        sectionName,
        roll,
        search,
        page,
        limit,
    });

    res.json(students.map(toExternalFields));
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = toInternalFields(req.body);
    if (!payload.admissionDate) {
        payload.admissionDate = new Date();
    }

    const message = await addNewStudent(payload);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await getStudentDetail(id);
    const updatePayload = toInternalFields(req.body);

    const message = await updateStudent({
        ...student,
        ...updatePayload,
        userId: id,
    });

    res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await getStudentDetail(id);
    res.json(toExternalFields(student));
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const message = await setStudentStatus({ userId: id, status });
    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
