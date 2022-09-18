const { createTaskSchema, updateTaskSchema, deleteTaskSchema } = require('../schema/task.schema');
const { createTaskHandler, getTaskListHandler, updateTaskHandler, deleteTaskHandler } = require('../controller/task.controller');
const {
  createProjectHandler,
  getProjectListHandler,
  updateProjectHandler,
  deleteProjectHandler,
  addTasksToProjectHandler,
  getTasksByProjectNameHandler
} = require('../controller/project.controller');
const validate = require('../middleware/validateResource');

function routes(app) {
  app.get('/healthcheck', (req, res) => {
    return res.sendStatus(200);
  });

  app.route('/api/task')
  .post([validate(createTaskSchema)], createTaskHandler)
  .get(getTaskListHandler);

  app.route('/api/task/:taskId')
  .put([validate(updateTaskSchema)], updateTaskHandler)
  .delete([validate(deleteTaskSchema)], deleteTaskHandler);

  app.route('/api/project')
  .post([], createProjectHandler)
  .get(getProjectListHandler);

  app.route('/api/project/:projectId')
  .put([], updateProjectHandler)
  .delete([], deleteProjectHandler);

  app.route('/api/project/addTasksToProject')
  .post([], addTasksToProjectHandler);

  app.route('/api/project/getTaskByProjectName')
  .get([], getTasksByProjectNameHandler);
}

module.exports = routes;