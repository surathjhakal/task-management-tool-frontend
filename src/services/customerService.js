import http from '../http-axios'

const customerSignup = (data) => {
  return http.post('/customer/signup', data)
}

const customerLogin = (data) => {
  return http.post('/customer/login', data)
}

const getCustomer = (id) => {
  return http.get(`/customer/${id}`)
}

const getAllCustomers = () => {
  return http.post(`/customer/getAllCustomers`)
}

const updateCustomer = (id, data) => {
  return http.put(`/customer/${id}`, data)
}

const deleteCustomer = (id) => {
  return http.delete(`/customer/${id}`)
}

const customerService = {
  customerLogin,
  customerSignup,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
}

export default customerService
