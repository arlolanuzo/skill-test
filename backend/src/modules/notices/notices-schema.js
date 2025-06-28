const { z } = require("zod");
const { POSTGRES_INTEGER_MAX } = require("../../constants");

const idField = z.coerce
    .number()
    .int({ message: "ID must be an integer" })
    .min(1, { message: "ID must be a positive integer" })
    .max(POSTGRES_INTEGER_MAX, {
        message: `ID must not exceed value '${POSTGRES_INTEGER_MAX}'`,
    });

const noticeDetailsSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(1, "Description must be at least 1 character")
        .max(400, "Description must be less than 400 characters"),
    status: z.coerce
        .number()
        .int()
        .min(1, "Status ID must be a positive integer")
        .max(POSTGRES_INTEGER_MAX, {
            message: `Status ID must not exceed value '${POSTGRES_INTEGER_MAX}'`,
        })
        .optional(),
    recipientType: z.enum(["SP", "EV"], {
        message: "Recipient type must be either 'SP' or 'EV'",
    }),
    recipientRole: z.coerce
        .number()
        .int()
        .min(0, "Recipient role ID must be a non-negative integer")
        .max(POSTGRES_INTEGER_MAX, {
            message: `Recipient role ID must not exceed value '${POSTGRES_INTEGER_MAX}'`,
        })
        .optional(),
    recipientFirstField: z
        .string()
        .max(20, "Recipient first field must be less than 20 characters")
        .optional(),
});

const CreateNoticeSchema = z.object({
    body: noticeDetailsSchema,
});

module.exports = {
    CreateNoticeSchema,
};
