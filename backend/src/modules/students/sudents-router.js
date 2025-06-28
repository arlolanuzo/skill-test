const express = require("express");
const router = express.Router();
const studentController = require("./students-controller");
const {
    GetStudentSchema,
    SearchStudentSchema,
    CreateStudentSchema,
    UpdateStatusSchema,
    UpdateStudentSchema,
} = require("./students-schema");
const { validateRequest } = require("../../utils");

router.get(
    "",
    validateRequest(SearchStudentSchema),
    studentController.handleGetAllStudents
);
router.post(
    "",
    validateRequest(CreateStudentSchema),
    studentController.handleAddStudent
);

router.get(
    "/:id",
    validateRequest(GetStudentSchema),
    studentController.handleGetStudentDetail
);
router.post(
    "/:id/status",
    validateRequest(UpdateStatusSchema),
    studentController.handleStudentStatus
);
router.put(
    "/:id",
    validateRequest(UpdateStudentSchema),
    studentController.handleUpdateStudent
);

module.exports = { studentsRoutes: router };
