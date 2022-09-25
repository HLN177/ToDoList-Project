const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

// ------------------------Create----------------------

async function _create(docs) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').insertOne(docs);
  return result;
}

/**
 * create a new project
 * @param {object} project
 * @returns
 */
async function createProject(project) {
  return _create(project);
}

// -------------------------------Read-------------------------------------
async function _get(query) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').findOne(query);
  return result;
}

async function _getAll(query, sort) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').find(query).sort(sort).toArray();
  return result;
}

/**
 * get specific project by id
 * @param {*} id
 * @returns
 */
async function getProjectById(id) {
  const query = {
    _id: ObjectID(id)
  };
  return _get(query);
}

/**
 * get project with conditions
 * @param {*} query
 * @param {*} sort
 * @returns
 */
async function getProjects(query = {}, sort = {}) {
  return await _getAll(query, sort);
}

// -------------------------------Update-------------------------------------

async function _updateProject(query, updateDocument) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').updateOne(query, updateDocument);
  return result;
}

/**
 * update project
 * @param {*} id
 * @param {*} newProject
 */
async function updateProject(id, newProject) {
  const query = {
    _id: ObjectID(id)
  };
  const updateDocument = {
    $set: newProject
  };
  const {modifiedCount, matchedCount} = await _updateProject(query, updateDocument);
  if (!modifiedCount && !matchedCount) {
    throw new Error('Project does not exists');
  }
}


/**
 * add task to specific project
 * @param {*} projectId
 * @param {Array} taskId
 * @returns
 */
async function addTasksToProject(projectId, taskIds) {
  const query = {
    _id: ObjectID(projectId)
  };
  const updateDocument = {
    $addToSet: { Tasks: { $each: taskIds} }
  };
  const result = await _updateProject(query, updateDocument);
  return result;
}

/**
 *
 * @param {*} projectId
 * @param {Array} taskIds
 * @returns
 */
async function deleteProjectRelatedTask(projectId, taskIds) {
  const query = {
    _id: ObjectID(projectId)
  };
  const updateDocument = {
    $pull: { Tasks: { $in: taskIds} }
  };
  return await _updateProject(query, updateDocument);
}

// -------------------------------Delete-------------------------------------
async function _delete(query) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').deleteOne(query);
  return result;
}

/**
 * delete projects
 * @param {*} id
 */
async function deleteProject(id) {
  const query = {
    _id: ObjectID(id)
  };
  const {deletedCount} = await _delete(query);
  if (!deletedCount) {
    throw new Error('Project does not exists');
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addTasksToProject,
  deleteProjectRelatedTask,
  deleteProject
};