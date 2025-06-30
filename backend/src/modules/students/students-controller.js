const asyncHandler = require("express-async-handler");
const {
    getAllStudents,
    addNewStudent,
    getStudentDetail,
    setStudentStatus,
    updateStudent,
} = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const {
        name,
        class: className,
        section,
        roll,
        search,
        page = 1,
        limit = 10,
    } = req.query;

    const students = await getAllStudents({
        name,
        className,
        section,
        roll,
        search,
        page,
        limit,
    });

    res.json(students);
});

const handleAddStudent = asyncHandler(async (req, res) => {
    if (!req.body.admissionDate) {
        req.body.admissionDate = new Date();
    }

    const message = await addNewStudent(req.body);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await getStudentDetail(id);

    const message = await updateStudent({
        ...student,
        ...req.body,
        userId: id,
    });

    res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const student = await getStudentDetail(id);
    res.json(student);
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
