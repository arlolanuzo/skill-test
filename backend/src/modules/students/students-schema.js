const { z } = require("zod");
const { POSTGRES_INTEGER_MAX } = require("../../constants");

const idField = z.coerce
    .number()
    .int()
    .min(1, { message: "ID must be a positive integer" })
    .max(POSTGRES_INTEGER_MAX, {
        message: `ID must not exceed value '${POSTGRES_INTEGER_MAX}'`,
    });

const studentDetailsSchema = z.object({
    name: z
        .string()
        .min(1, "Name must be at least 1 charact")
        .max(100, "Name must be less than 100 characters"),
    email: z
        .string()
        .email("Invalid email format")
        .max(100, "Email must be less than 100 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    dob: z.coerce.date().optional(),
    phone: z
        .string()
        .regex(/^\+?[0-9-]+$/, "Phone number must be a valid phone number")

        .min(1, "Phone number must be at least 1 character")
        .max(20, "Phone number must be less than 20 characters"),

    admission_date: z.coerce.date().optional(),
    class_name: z
        .string()
        .min(1, "Class name must be at least 1 character")
        .max(50, "Class name must be less than 50 characters"),
    section_name: z
        .string()
        .min(1, "Section must be at least 1 character")
        .max(50, "Section must be less than 50 characters"),
    roll: z
        .number()
        .min(1)
        .max(POSTGRES_INTEGER_MAX, {
            message: `Roll number must not exceed value '${POSTGRES_INTEGER_MAX}'`,
        }),

    father_name: z
        .string()
        .min(1, "Father's name must be at least 1 character")
        .max(50, "Father's name must be less than 50 characters"),
    father_phone: z
        .string()
        .regex(
            /^\+?[0-9-]+$/,
            "Father's phone number must be a valid phone number"
        )
        .min(1, "Father's phone number must be at least 1 character")
        .max(20, "Father's phone number must be less than 20 characters")
        .optional(),

    mother_name: z
        .string()
        .min(1, "Mother's name must be at least 1 character")
        .max(50, "Mother's name must be less than 50 characters")
        .optional(),
    mother_phone: z
        .string()
        .regex(
            /^\+?[0-9-]+$/,
            "Father's phone number must be a valid phone number"
        )
        .min(1, "Mother's phone number must be at least 1 character")
        .max(20, "Mother's phone number must be less than 20 characters")
        .optional(),

    guardian_name: z
        .string()
        .min(1, "Guardian's name must be at least 1 character")
        .max(50, "Guardian's name must be less than 50 characters"),
    guardian_phone: z
        .string()
        .regex(
            /^\+?[0-9-]+$/,
            "Guardians's phone number must be a valid phone number"
        )
        .min(1, "Guardian's phone number must be at least 1 character")
        .max(20, "Guardian's phone number must be less than 20 characters"),
    relation_of_guardian: z
        .string()
        .min(1, "Relation of guardian must be at least 1 character")
        .max(30, "Relation of guardian must be less than 30 characters"),

    current_address: z
        .string()
        .min(1, "Current address must be at least 1 character")
        .max(50, "Address must be less than 50 characters"),
    permanent_address: z
        .string()
        .min(1, "Permanent address must be at least 1 character")
        .max(50, "Address must be less than 50 characters"),
});

const CreateStudentSchema = z.object({
    body: studentDetailsSchema,
});

const GetStudentSchema = z.object({
    params: z.object({
        id: idField,
    }),
});

const SearchStudentSchema = z.object({
    query: z.object({
        name: z
            .string()
            .max(100, "Name must be less than 100 characters")
            .optional(),
        class_name: z
            .string()
            .max(50, "Class name must be less than 50 characters")
            .optional(),
        section_name: z
            .string()
            .max(50, "Section must be less than 50 characters")
            .optional(),
        roll: z.coerce
            .number()
            .int()
            .min(1, { message: "roll must be a positive integer" })
            .max(POSTGRES_INTEGER_MAX, {
                message: `Roll number must not exceed value '${POSTGRES_INTEGER_MAX}'`,
            })
            .optional(),
        search: z
            .string()
            .max(100, "Name must be less than 100 characters")
            .optional(),
        page: z.coerce
            .number()
            .int()
            .min(1)
            .max(POSTGRES_INTEGER_MAX)
            .default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
    }),
});

const UpdateStudentSchema = z.object({
    body: studentDetailsSchema.partial(),
    params: z.object({
        id: idField,
    }),
});

const UpdateStatusSchema = z.object({
    body: z.object({
        status: z.boolean(),
    }),
    params: z.object({
        id: idField,
    }),
});

module.exports = {
    CreateStudentSchema,
    GetStudentSchema,
    SearchStudentSchema,
    UpdateStatusSchema,
    UpdateStudentSchema,
};
