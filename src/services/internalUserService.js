import http from '../http-axios'

const adminSignup = (data) => {
  return http.post('/internalUser/signup', data)
}

const adminLogin = (data) => {
  return http.post('/internalUser/login', data)
}

const getAdminUser = (id) => {
  return http.get(`/internalUser/${id}`)
}

const getAllUsers = () => {
  return http.post(`/internalUser/getAllUsers`)
}

const updateAdminUser = (id, data) => {
  return http.put(`/internalUser/${id}`, data)
}

const deleteAdminUser = (id) => {
  return http.delete(`/internalUser/${id}`)
}

const internalUserService = {
  adminLogin,
  adminSignup,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getAllUsers,
}

export default internalUserService
