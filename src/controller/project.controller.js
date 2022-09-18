const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addTasks
} = require('../service/project.service');

const {
  getTasksByIds
  // updateBindProject,
} = require('../service/task.service');

async function createProjectHandler(req, res) {
  // init project
  const project = {
    ...req.body,
    DoneDate: ''
  };
  try {
    const {insertedId} = await createProject(project);
    // const {Tasks} = req.body;
    // if (Array.isArray(Tasks) && Tasks.length) {
    //   await updateBindProject(Tasks, insertedId);
    // }
    return res.send({
      projectId: insertedId
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * getProjectList support search using query, including sortBy and isAsc
 * status = done / to-do
 * sortBy = StartDate / DueDate / DoneDate
 * isAsc = 1 / -1
 * @returns
 */
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
    await updateProject(projectId, project);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found, return 404
  }
}

async function deleteProjectHandler(req, res) {
  const {projectId} = req.params;
  try {
    const result = await deleteProject(projectId);
    return res.send(result);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function addTasksToProjectHandler(req, res) {
  const {ProjectId, TaskId} = req.body;
  try {
    const result = await addTasks(ProjectId, TaskId);
    // await updateBindProject([TaskId], ProjectId);
    return res.send(result);
  } catch (err) {
    return res.status(404).send(err);
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
    return res.status(500).send(err.message);
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