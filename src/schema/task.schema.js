const {object, string, number, date, preprocess} = require('zod');

const payload = {
  body: object({
    TaskName: string({
      required_error: "TaskName is required"
    }).min(1),
    StartDate: string({
      required_error: "StartDate is required"
    }),
    DueDate: string({
      required_error: "DueDate is required"
    })
    // StartDate: preprocess(arg => {
    //   if (typeof arg === 'string' || arg instanceof Date) {
    //     return new Date(arg);
    //   }
    // }, date()).safeParse(),
    // DueDate: date({
    //   required_error: "DueDate is required",
    //   invalid_type_error: "That's not a date"
    // })
  })
};

const params = {
  params: object({
    taskId: string({
      required_error: "TaskId is required"
    })
  })
};

const createTaskSchema = object({
  ...payload
});

const updateTaskSchema = object({
  ...payload,
  ...params
});

const deleteTaskSchema = object({
  ...params
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema
};