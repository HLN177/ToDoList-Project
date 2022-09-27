const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../service/task.service');

const { deleteProjectRelatedTask } = require('../service/project.service');

async function createTaskHandler(req, res) {
  try {
    // 1. init task structure
    const task = {
      ...req.body,
      linkedProject: '',
      Status: 'to-do',
      DoneDate: ''
    };
    // 2. create task
    const { insertedId } = await createTask(task);
    // 3. send back taskId
    return res.send({
      taskId: insertedId
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
  // 1. get the query and the sort params for db request
  const {status, name, sortBy, isAsc = 1} = req.query;
  // 2. format db query params
  if (status) {
    query.Status = status;
  }
  if (name) {
    query.TaskName = new RegExp(`${name}`, "i"); // filter name by Regex
  }
  // 3. format db sort params
  if (sortBy) {
    sort[sortBy] = isAsc;
  }
  // 4. get tasks list
  try {
    const taskList = await getTasks(query, sort);
    // 5. send back tasks
    return res.send(taskList);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function getTaskHandler(req, res) {
  // 1. get taskId from params;
  const {taskId} = req.params;
  try {
    // 2. get task
    const task = await getTaskById(taskId);
    // 3. send back task info
    return res.send(task);
  } catch (err) {
    return res.status(404).send(err.message); // not found return 404
  }
}

async function updateTaskHandler(req, res) {
  const newTask = {
    ...req.body
  };
  // 1. get taskId from params
  const {taskId} = req.params;
  try {
    // 2. get original project id
    // const {linkedProject: linkedProjectOld} = await getTaskById(taskId);
    // 3. update task
    await updateTask(taskId, newTask);
    // 4. delete the task id in original project
    // if (linkedProjectOld && (linkedProjectNew !== linkedProjectOld)) {
    //   await deleteProjectRelatedTask(linkedProjectOld, [taskId]);
    // }
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found return 404
  }
}

async function deleteTaskHandler(req, res) {
  const {taskId} = req.params;
  try {
    // 1. get previous project info
    const {linkedProject} = await getTaskById(taskId);
    // 2. delete task
    await deleteTask(taskId);
    // 3. update previous project info
    linkedProject && await deleteProjectRelatedTask(linkedProject, [taskId]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found return 404
  }
}

module.exports = {
  createTaskHandler,
  getTaskListHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
};