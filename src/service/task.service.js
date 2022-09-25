const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

const { deleteProjectRelatedTask } = require('./project.service');

// ------------------------Create----------------------
async function _create(dos) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').insertOne(dos);
  return result;
}

async function createTask(task) {
  return _create(task);
}

// -------------------------------Read-------------------------------------
async function _get(query) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').findOne(query);
  return result;
}

async function _getAll(query, sort) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').find(query).sort(sort).toArray();
  return result;
}


/**
 * query tasks by query filter and sort function
 * @param {object} query
 * @param {object} sort
 * @returns
 */
async function getTasks(query = {}, sort = {}) {
  return _getAll(query, sort);
}

/**
 * @param {string} id taskid
 */
async function getTaskById(id) {
  const query = {
    _id: ObjectID(id)
  };
  return _get(query);
}

/**
 * query task by id list
 * @param {Array} ids task id array
 * @returns task list
 */
async function getTasksByIds(ids) {
  const tasks = ids.map(id => {
    return getTaskById(id);
  });
  const result = await Promise.all(tasks);
  return result;
}

// -------------------------------Update-------------------------------------
async function _update(query, updateDocument) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').updateOne(query, updateDocument);
  return result;
}

/**
 * update task by id
 * @param {string} id task id
 * @param {object} newTask new Params
 */
async function updateTask(id, newTask) {
  const query = {
    _id: ObjectID(id)
  };
  const updateDocument = {
    $set: newTask
  };
  const {modifiedCount, matchedCount} = await _update(query, updateDocument);
  if (!modifiedCount && !matchedCount) {
    throw new Error('Task does not exists');
  }
}

async function resetTaskRelatedProject(taskId) {
  const query = {
    _id: ObjectID(taskId)
  };
  const updateDocument = {
    $set: {linkedProject: ''}
  };
  return await _update(query, updateDocument);
}


async function updateTaskLinkedProject(taskId, projectId) {
  try {
    // 1. get original project id
    const {linkedProject} = await getTaskById(taskId);
    // 2. update linked project on task
    await updateTask(taskId, {linkedProject: projectId});
    // 3. delete the task id in original project
    linkedProject && await deleteProjectRelatedTask(linkedProject, [taskId]);
  } catch (err) {
    console.log(err);
  }
}

// -------------------------------Delete-------------------------------------
async function _delete(query) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').deleteOne(query);
  return result;
}

/**
 * delte task by id
 * @param {string} id task id
 */
async function deleteTask(id) {
  const query = {
    _id: ObjectID(id)
  };
  const {deletedCount} = await _delete(query);
  if (!deletedCount) {
    throw new Error('Task does not exists');
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTasksByIds,
  updateTask,
  resetTaskRelatedProject,
  updateTaskLinkedProject,
  deleteTask
};