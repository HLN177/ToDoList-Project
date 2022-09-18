const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

const { getProjectById, updateProject } = require('./project.service');

async function createTask(task) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').insertOne(task);
  return result;
}

/**
 * query tasks by query filter and sort function
 * @param {object} query
 * @param {object} sort
 * @returns
 */
async function getTasks(query = {}, sort = {}) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').find(query).sort(sort).toArray();
  return result;
}

async function getTask(query = {}) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').findOne(query);
  return result;
}

/**
 * query task by id list
 * @param {Array} ids task id array
 * @returns task list
 */
async function getTasksByIds(ids) {
  const tasks = ids.map(item => {
    const query = {
      _id: ObjectID(item)
    };
    return getTask(query);
  });
  const result = await Promise.all(tasks);
  return result;
}

/**
 * update task by id
 * @param {string} id task id
 * @param {object} newTask new Params
 */
async function updateTask(id, newTask) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const {modifiedCount, matchedCount} = await dbConnect.collection('tasks').updateOne(query, { $set: newTask});
  if (!modifiedCount && !matchedCount) {
    throw new Error('Task does not exists');
  }
}

/**
 * delte task by id
 * @param {string} id task id
 */
async function deleteTask(id) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const {deletedCount} = await dbConnect.collection('tasks').deleteOne(query);
  if (!deletedCount) {
    throw new Error('Task does not exists');
  }
}

/**
 * move one task from one project to anthor project
 * not finish yet
 * @param {string} taskId TaskId
 * @param {string} projectId ProjectId
 */
async function updateBindProjectByID(taskId, projectId = '') {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(taskId)
  };
  const {BindWithProject} = await getTask(query);
  if (BindWithProject) {
    const project = await getProjectById(BindWithProject);
    if (project) {
      const { Tasks } = project;
      const newTasks = Tasks.filter(item => {
        return item !== taskId;
      });
      await updateProject(projectId, {Tasks: newTasks});
    }
  }
  const {modifiedCount, matchedCount} = await dbConnect.collection('tasks').updateOne(query, { $set: {BindWithProject: projectId}});
  if (!modifiedCount && !matchedCount) {
    throw new Error('Task does not exists');
  }
}

/**
 * move one task from one project to anthor project
 * not finish yet
 * @param {string} taskId TaskId
 * @param {string} projectId ProjectId
 */
async function updateBindProject(taskIdArr, projectId = '') {
  const tasks = taskIdArr.map(item => {
    return updateBindProjectByID(item, projectId);
  });
  await Promise.all(tasks);
}

module.exports = {
  createTask,
  getTasks,
  getTasksByIds,
  updateTask,
  deleteTask,
  updateBindProjectByID,
  updateBindProject
};