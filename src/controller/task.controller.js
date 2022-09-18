const { createTask, getTasks, updateTask, deleteTask } = require('../service/task.service');

async function createTaskHandler(req, res) {
  try {
    // init task
    const task = {
      ...req.body,
      BindWithProject: '',
      Status: 'to-do',
      DoneDate: ''
    };
    const { insertedId } = await createTask(task);
    return res.send({
      taskId: insertedId // send back taskId
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * getTaskList support search using query, including status, name, sortBy and isAsc
 * status = done / to-do
 * sortBy = StartDate / DueDate / DoneDate
 * isAsc = 1 / -1
 * @returns
 */
async function getTaskListHandler(req, res) {
  const query = {};
  const sort = {};

  const {status, name, sortBy, isAsc = 1} = req.query;
  // format db query params
  if (status) {
    query.Status = status;
  }
  if (name) {
    query.TaskName = new RegExp(`${name}`, "i"); // filter name by Regex
  }

  // format db sort params
  if (sortBy) {
    sort[sortBy] = isAsc;
  }

  try {
    const taskList = await getTasks(query, sort);
    return res.send(taskList);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function updateTaskHandler(req, res) {
  const newTask = {
    ...req.body
  };
  const {taskId} = req.params; // get taskId from params
  try {
    await updateTask(taskId, newTask);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found return 404
  }
}

async function deleteTaskHandler(req, res) {
  const {taskId} = req.params;
  try {
    await deleteTask(taskId);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found return 404
  }
}

module.exports = {
  createTaskHandler,
  getTaskListHandler,
  updateTaskHandler,
  deleteTaskHandler
};