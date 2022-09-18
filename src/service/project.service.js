const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

async function createProject(project) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').insertOne(project);
  return result;
}

async function getProjectById(id) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const result = await dbConnect.collection('projects').findOne(query);
  return result;
}

async function getProjects(query = {}, sort = {}) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').find(query).sort(sort).toArray();
  return result;
}

async function updateProject(id, newProject) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const {modifiedCount, matchedCount} = await dbConnect.collection('projects').updateOne(query, { $set: newProject});
  if (!modifiedCount && !matchedCount) {
    throw new Error('Project does not exists');
  }
}

async function deleteProject(id) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const {deletedCount} = await dbConnect.collection('projects').deleteOne(query);
  if (!deletedCount) {
    throw new Error('Project does not exists');
  }
}

async function addTasks(projectId, taskId) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(projectId)
  };
  const result = await dbConnect.collection('projects').updateOne(query, {
    $addToSet: { Tasks: taskId }
  });
  return result;
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTasks
};