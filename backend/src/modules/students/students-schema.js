const { z } = require("zod");
const {
    POSTGRES_INTEGER_MAX,
    REGEX_NAME,
    REGEX_PHONE_NUMBER,
    REGEX_CLASS_NAME,
} = require("../../constants");

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
        .trim()
        .regex(
            REGEX_NAME,
            "Name must contain only letters, numbers, spaces, dots, hyphens, and apostrophes"
        )
        .min(1, "Name must be at least 1 character")
        .max(100, "Name must be less than 100 characters"),
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .max(100, "Email must be less than 100 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    dob: z.coerce.date(),
    phone: z
        .string()
        .trim()
        .regex(REGEX_PHONE_NUMBER, "Phone number must be a valid phone number")

        .min(1, "Phone number must be at least 1 character")
        .max(20, "Phone number must be less than 20 characters"),

    admissionDate: z.coerce.date().optional(),
    class: z
        .string()
        .trim()
        .regex(
            REGEX_CLASS_NAME,
            "Class must contain only letters, numbers, spaces, dots and hyphens"
        )
        .min(1, "Class name must be at least 1 character")
        .max(50, "Class name must be less than 50 characters"),
    section: z
        .string()
        .trim()
        .regex(
            REGEX_CLASS_NAME,
            "Section must contain only letters, numbers, spaces, dots and hyphens"
        )
        .min(1, "Section must be at least 1 character")
        .max(50, "Section must be less than 50 characters"),
    roll: z.coerce
        .number()
        .min(1)
        .max(POSTGRES_INTEGER_MAX, {
            message: `Roll number must not exceed value '${POSTGRES_INTEGER_MAX}'`,
        }),

    fatherName: z
        .string()
        .trim()
        .regex(
            REGEX_NAME,
            "Father's name must contain only letters, numbers, spaces, dots, hyphens, and apostrophes"
        )
        .min(1, "Father's name must be at least 1 character")
        .max(50, "Father's name must be less than 50 characters"),
    fatherPhone: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) =>
                !val ||
                (REGEX_PHONE_NUMBER.test(val) &&
                    val.length >= 1 &&
                    val.length <= 20),
            {
                message:
                    "Father's phone number must be a valid phone number (1-20 chars, digits, +, - allowed)",
            }
        ),

    motherName: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) => {
                if (!val) {
                    return true;
                }
                return (
                    val.length >= 1 && val.length <= 50 && REGEX_NAME.test(val)
                );
            },
            {
                message:
                    "Mother's name must be 1-50 characters and must only contain letters, numbers, spaces, dots, hyphens and aphostrophes if provided",
            }
        ),
    motherPhone: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) =>
                !val ||
                (REGEX_PHONE_NUMBER.test(val) &&
                    val.length >= 1 &&
                    val.length <= 20),
            {
                message:
                    "Mother's phone number must be a valid phone number (1-20 chars, digits, +, - allowed)",
            }
        ),

    guardianName: z
        .string()
        .trim()
        .regex(
            REGEX_NAME,
            "Guardians's name must contain only letters, numbers, spaces, dots, hyphens, and apostrophes"
        )
        .min(1, "Guardian's name must be at least 1 character")
        .max(50, "Guardian's name must be less than 50 characters"),
    guardianPhone: z
        .string()
        .trim()
        .regex(
            REGEX_PHONE_NUMBER,
            "Guardians's phone number must be a valid phone number (1-20 chars, digits, +, - allowed)"
        )
        .min(1, "Guardian's phone number must be at least 1 character")
        .max(20, "Guardian's phone number must be less than 20 characters"),
    relationOfGuardian: z
        .string()
        .trim()
        .regex(
            /^[a-zA-Z0-9 ]+$/,
            "Guardians's name must contain only letters and numbers"
        )
        .min(1, "Relation of guardian must be at least 1 character")
        .max(30, "Relation of guardian must be less than 30 characters"),

    currentAddress: z
        .string()
        .trim()
        .min(1, "Current address must be at least 1 character")
        .max(50, "Address must be less than 50 characters"),
    permanentAddress: z
        .string()
        .trim()
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
            .trim()
            .regex(
                REGEX_NAME,
                "Name must contain only letters, numbers, spaces, dots, hyphens, and apostrophes"
            )
            .max(100, "Name must be less than 100 characters")
            .optional(),
        class: z
            .string()
            .trim()
            .regex(
                REGEX_CLASS_NAME,
                "Class must contain only letters, numbers, spaces, dots and hyphens"
            )
            .max(50, "Class name must be less than 50 characters")
            .optional(),
        section: z
            .string()
            .trim()
            .regex(
                REGEX_CLASS_NAME,
                "Class must contain only letters, numbers, spaces, dots and hyphens"
            )
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
            .trim()
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
