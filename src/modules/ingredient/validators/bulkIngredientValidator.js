const yup = require("yup");

const bulkUpdateSchema = yup.object({
  ids: yup.array().of(yup.string().length(24, "ID invalide")).required("IDs required"),
  update: yup.object().required("Update object required"),
});

module.exports = {
  bulkUpdateSchema,
};
