import http from '../http-axios'

const createComment = (data) => {
  return http.post('/comment/create', data)
}

const getComments = (data) => {
  return http.post(`/comment/get`, data)
}

const updateComment = (id, data) => {
  return http.put(`/comment/${id}`, data)
}

const deleteComment = (data) => {
  return http.post(`/comment/delete`, data)
}

const commentService = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
}

export default commentService
