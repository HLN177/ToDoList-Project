const { createTask, getTasks, updateTask, deleteTask } = require('../service/task.service');

async function createTaskHandler(req, res) {
  try {
    const {TaskName, StartDate, DueDate} = req.body;
    const task = {
      TaskName,
      StartDate,
      DueDate,
      Status: 'to-do',
      DoneDate: ''
    };
    const taskRes = await createTask(task);
    return res.send(taskRes);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function getTaskListHandler(req, res) {
  const query = {};
  const sort = {};

  const {status, name, sortBy, isAsc = 1} = req.query;
  if (status) {
    query.Status = status;
  }
  if (name) {
    query.TaskName = new RegExp(`${name}`, "i");
  }
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
  const {TaskName, StartDate, DueDate, Status, DoneDate} = req.body;
  const newTask = {
    TaskName,
    StartDate,
    DueDate,
    Status,
    DoneDate
  };
  const {taskId} = req.params;
  try {
    const result = await updateTask(taskId, newTask);
    return res.send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
}

async function deleteTaskHandler(req, res) {
  const {taskId} = req.params;
  try {
    const result = await deleteTask(taskId);
    return res.send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
}

module.exports = {
  createTaskHandler,
  getTaskListHandler,
  updateTaskHandler,
  deleteTaskHandler
};