import axios from 'axios'
export default axios.create({
  baseURL: 'https://task-management-tool-backend.onrender.com/api',
  headers: {
    'Content-type': 'application/json',
  },
})
