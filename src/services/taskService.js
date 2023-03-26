import http from '../http-axios'

const createTask = (data) => {
  return http.post('/task/create', data)
}

const getAllTasks = () => {
  return http.get(`/task/all`)
}

const getRecent5Tasks = (owner, status) => {
  return http.get(`/task/recent-tasks/${owner}?status=${status}`)
}

const getCompletedTaskLength = (owner) => {
  return http.get(`/task/completed-count/${owner}`)
}

const getTask = (uuid) => {
  return http.get(`/task/${uuid}`)
}

const getAllUUIDTasks = (tasks) => {
  return http.post(`/task/allUUIDTasks`, tasks)
}

const getUserTasks = (owner) => {
  return http.get(`/task/user/${owner}`)
}

const updateTask = (uuid, data) => {
  return http.put(`/task/${uuid}`, data)
}

const deleteTask = (id) => {
  return http.delete(`/task/${id}`)
}

const taskService = {
  createTask,
  getAllTasks,
  getRecent5Tasks,
  getTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getCompletedTaskLength,
  getAllUUIDTasks,
}

export default taskService
