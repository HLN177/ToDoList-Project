const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

async function createProject(project) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('projects').insertOne(project);
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
  const result = await dbConnect.collection('projects').updateOne(query, { $set: newProject});
  return result;
}

async function deleteProject(id) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const result = await dbConnect.collection('projects').deleteOne(query);
  return result;
}

async function addTasks(projectId, taskId) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(projectId)
  };
  console.log({
    projectId,
    taskId
  });
  const result = await dbConnect.collection('projects').updateOne(query, {
    $addToSet: { Tasks: taskId }
  })
  return result;
}

async function getTasksByProjectName(name) {

}

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addTasks,
  getTasksByProjectName
};