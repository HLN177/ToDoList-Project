const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTasksToProject
} = require('../service/project.service');

const {
  getTasksByIds,
  resetTaskRelatedProject,
  updateTaskLinkedProject
} = require('../service/task.service');

async function createProjectHandler(req, res) {
  const project = { // init project
    ...req.body,
    DoneDate: ''
  };
  const {Tasks} =  req.body;
  try {
    // 1. create new project document
    const {insertedId} = await createProject(project);
    // 2. update task linked information
    await Promise.all(Tasks.map(taskId => {
      return updateTaskLinkedProject(taskId, insertedId);
    }));
    // 3. send back new project id
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
  // 1. get query params
  const {sortBy, isAsc = 1} = req.query;
  // 2. format bd sort params
  if (sortBy) {
    sort[sortBy] = isAsc;
  }
  // 3. get all projects
  try {
    const projectList = await getProjects(query, sort);
    // 4. send back project list
    return res.send(projectList);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function updateProjectHandler(req, res) {
  const project = {
    ...req.body
  };
  // 1. get projectId
  const {projectId} = req.params;
  // 2. get task info from previous project
  const { Tasks: previousTasks } = await getProjectById(projectId);
  // 3. get new task info
  const { Tasks: newTasks } = req.body;
  // 4. group
  const taskToDelete = previousTasks.filter(task => newTasks.indexOf(task) === -1);
  const taskToAdd = newTasks.filter(task => previousTasks.indexOf(task) === -1);
  try {
    // 5. update project info
    await updateProject(projectId, project);
    // 6. reset task related project info
    const resetTaskArr = taskToDelete.map(taskId => {
      return resetTaskRelatedProject(taskId);
    });
    // 7. update task related project info
    const updateTaskArr = taskToAdd.map(taskId => {
      return updateTaskLinkedProject(taskId, projectId);
    });
    // 8. handle task data update
    await Promise.all(resetTaskArr.concat(updateTaskArr));
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message); // not found, return 404
  }
}

async function deleteProjectHandler(req, res) {
  const {projectId} = req.params;
  try {
    // 1. get original task info
    const {Tasks} = await getProjectById(projectId);
    // 2. delete project document
    await deleteProject(projectId);
    // 3. reset task related info
    if (Array.isArray(Tasks) && Tasks.length) {
      await Promise.all(Tasks.map(taskId => {
        return resetTaskRelatedProject(taskId);
      }));
    }
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function addTasksToProjectHandler(req, res) {
  const {ProjectId, TaskIds} = req.body;
  const taskIds = TaskIds.split(',');
  try {
    // 1. add task to new project
    await addTasksToProject(ProjectId, taskIds);
    // 2. update task related information
    await Promise.all(taskIds.map(taskId => {
      return updateTaskLinkedProject(taskId, ProjectId);
    }));
    return res.sendStatus(200);
  } catch (err) {
    return res.status(404).send(err);
  }
}

async function getTasksByProjectNameHandler(req, res) {
  const query = {};
  const { name } = req.query;
  query.ProjectName = new RegExp(`${name}`, "i");
  try {
    // 1. get all projects which name match with the query name string
    const projectListAll = await getProjects(query);
    // 2. get all task id
    let taskIdsAll = projectListAll.reduce((a, b) => {
      return a.concat(b.Tasks);
    }, []);
    // 3. distinct
    const taskIds = [...new Set(taskIdsAll)];
    // 4. get all task info
    const taskList = await getTasksByIds(taskIds);
    // 5. send back list
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