import http from '../http-axios'

const uploadFiles = (allFiles) => {
  return http.post('/files/upload-multiple', allFiles)
}

const uploadProfilePhoto = (file) => {
  return http.post('/files/upload-single', file)
}

const deleteFiles = (allFiles) => {
  return http.post(`/files/delete-multiple`, allFiles)
}

const filesService = {
  uploadFiles,
  uploadProfilePhoto,
  deleteFiles,
}

export default filesService
