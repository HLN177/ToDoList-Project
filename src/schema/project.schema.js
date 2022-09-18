const {object, string, date, preprocess} = require('zod');

const payload = {
  body: object({
    ProjectName: string({
      required_error: "Project Name is required"
    }).min(1),
    StartDate: preprocess(arg => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, date({
      required_error: "Start Date is required",
      invalid_type_error: "That's not a date!"
    })),
    DueDate: preprocess(arg => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, date({
      required_error: "Due Date is required",
      invalid_type_error: "That's not a date!"
    })),
    Tasks: string().optional().array()
  })
};

const params = {
  params: object({
    projectId: string({
      required_error: "ProjectID is required"
    })
  })
};

const createProjectSchema = object({
  ...payload
});

const updateProjectSchema = object({
  ...payload,
  ...params
});

const deleteProjectSchema = object({
  ...params
});

const addTaskToProjectSchema = object({
  body: object({
    ProjectId: string({
      required_error: "ProjectID is required"
    }),
    TaskId: string({
      required_error: "TaskId is required"
    })
  })
});

const getTaskByProjectnameSchema = object({
  params: object({
    name: string({
      required_error: "Project Name is required"
    })
  })
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  addTaskToProjectSchema,
  getTaskByProjectnameSchema
};