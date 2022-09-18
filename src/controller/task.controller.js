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
    const { insertedId } = await createTask(task);
    return res.send({
      taskId: insertedId
    });
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
  const newTask = {
    ...req.body
  };
  const {taskId} = req.params;
  try {
    await updateTask(taskId, newTask);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function deleteTaskHandler(req, res) {
  const {taskId} = req.params;
  try {
    await deleteTask(taskId);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

module.exports = {
  createTaskHandler,
  getTaskListHandler,
  updateTaskHandler,
  deleteTaskHandler
};