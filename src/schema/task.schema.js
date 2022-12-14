const {object, string, date, preprocess} = require('zod');

const payload = {
  body: object({
    TaskName: string({
      required_error: "TaskName is required"
    }).min(1),
    StartDate: preprocess(arg => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, date({
      required_error: "StartDate is required",
      invalid_type_error: "That's not a date!"
    })),
    DueDate: preprocess(arg => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, date({
      required_error: "DueDate is required",
      invalid_type_error: "That's not a date!"
    })),
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

const getTaskSchema = object({
  ...params
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
  getTaskSchema,
  updateTaskSchema,
  deleteTaskSchema
};