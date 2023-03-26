import http from '../http-axios'

const createNotification = (data) => {
  return http.post('/notification/create', data)
}

const getNotifications = (user) => {
  return http.get(`/notification/${user}`)
}

const deleteNotification = (id) => {
  return http.delete(`/notification/${id}`)
}

const notificationService = {
  createNotification,
  getNotifications,
  deleteNotification,
}

export default notificationService
