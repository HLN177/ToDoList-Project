const { getDb } = require('../db/connect');
const ObjectID = require('mongodb').ObjectID;

async function createTask(task) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').insertOne(task);
  return result;
}

async function getTasks(query = {}, sort = {}) {
  const dbConnect = getDb();
  const result = await dbConnect.collection('tasks').find(query).sort(sort).toArray();
  return result;
}

async function getTasksByIds(ids) {
  console.log(ids);
  const tasks = ids.map(item => {
    const query = {
      _id: ObjectID(item)
    };
    return getTasks(query);
  });
  const result = await Promise.all(tasks);
  return result.flat();
}

async function updateTask(id, newTask) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  const result = await dbConnect.collection('tasks').updateOne(query, { $set: newTask});
  return result;
}

async function deleteTask(id) {
  const dbConnect = getDb();
  const query = {
    _id: ObjectID(id)
  };
  console.log(query);
  const result = await dbConnect.collection('tasks').deleteOne(query);
  return result;
}

module.exports = {
  createTask,
  getTasks,
  getTasksByIds,
  updateTask,
  deleteTask
};