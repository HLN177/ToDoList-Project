const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addTasks,
  getTasksByProjectName
} = require('../service/project.service');

const {
  getTasksByIds
} = require('../service/task.service');

async function createProjectHandler(req, res) {
  const project = {
    ...req.body,
    Tasks: []
  };
  try {
    const dbRes = await createProject(project);
    return res.send(dbRes);
  } catch (err) {
    return res.status(500).send(error);
  }
  return res.send(200);
}

async function getProjectListHandler(req, res) {
  const query = {};
  const sort = {};
  const {sortBy, isAsc = 1} = req.query;
  if (sortBy) {
    sort[sortBy] = isAsc;
  }
  try {
    const projectList = await getProjects(query, sort);
    return res.send(projectList);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function updateProjectHandler(req, res) {
  const project = {
    ...req.body
  };
  const {projectId} = req.params;
  try {
    const result = await updateProject(projectId, project);
    return res.send(result);
  } catch (error) {
    return res.status(404).send(error);
  }
}

async function deleteProjectHandler(req, res) {
  const {projectId} = req.params;
  try {
    const result = await deleteProject(projectId);
    return res.send(result);
  } catch(err) {
    return res.status(404).send(error);
  }
}

async function addTasksToProjectHandler(req, res) {
  const {ProjectId, TaskId} = req.body;
  try {
    const result = await addTasks(ProjectId, TaskId);
    return res.send(result);
  } catch (err) {
    return res.status(404).send(error);
  }
}

async function getTasksByProjectNameHandler(req, res) {
  const query = {};
  const { name } = req.query;
  query.ProjectName = new RegExp(`${name}`, "i");
  try {
    const projectListAll = await getProjects(query);
    let taskIdsAll = projectListAll.reduce((a, b) => {
      return a.concat(b.Tasks);
    }, []);
    const taskIds = [...new Set(taskIdsAll)];
    const taskList = await getTasksByIds(taskIds);
    return res.send(taskList);
  } catch (err) {
    return res.status(404).send(error);
  }
}

module.exports = {
  createProjectHandler,
  getProjectListHandler,
  updateProjectHandler,
  deleteProjectHandler,
  addTasksToProjectHandler,
  getTasksByProjectNameHandler
};