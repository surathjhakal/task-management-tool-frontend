import {
  CAvatar,
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import '../../css/TaskInfo.css'
import PropTypes from 'prop-types'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DatePicker from 'react-datepicker'
import { MdDelete } from 'react-icons/md'
import { IoMdSend } from 'react-icons/io'
import HeaderContext from '../../HeaderContext'
import taskService from '../../services/taskService'
import { v4 as uuidv4 } from 'uuid'
import commentService from '../../services/commentService'
import internalUserService from '../../services/internalUserService'
import { toast } from 'react-toastify'
import { ImCross } from 'react-icons/im'
import filesService from '../../services/filesService'
import customerService from '../../services/customerService'

const UpdateTask = ({ data, show, handleShowTaskModal, UpdatedTask, calledFrom }) => {
  UpdateTask.propTypes = {
    data: PropTypes.node.isRequired,
    show: PropTypes.node.isRequired,
    handleShowTaskModal: PropTypes.node.isRequired,
    UpdatedTask: PropTypes.node.isRequired,
    calledFrom: PropTypes.node.isRequired,
  }

  const { userData, setUserData } = useContext(HeaderContext)
  const [allInternalUsers, setAllInternalUsers] = useState([])
  const [loadInternalUsers, setLoadInternalUsers] = useState([])
  const [taskData, setTaskData] = useState({
    ...data,
    due_date: new Date(data.due_date),
    comments: [],
    assigned_users: [],
  })
  const [addNewComment, setAddNewComment] = useState('')
  const animatedComponents = makeAnimated()
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [taskSaving, setTaskSaving] = useState(false)
  const [fetchedCommentsData, setFetchedCommentsData] = useState([])
  const [allCustomers, setAllCustomers] = useState([])

  // USE EFFECT
  useEffect(() => {
    setLoadInternalUsers(true)
    internalUserService.getAllUsers().then((res) => {
      const tempUsers = res.data.map((user) => {
        return {
          ...user,
          value: user.name,
          label: user.name,
        }
      })
      setAllInternalUsers(tempUsers)
    })
    customerService.getAllCustomers().then((res) => {
      setAllCustomers(res.data)
    })
  }, [])

  useEffect(() => {
    if (data?.comments?.length > 0) {
      setCommentsLoading(true)
      commentService.getComments({ comments: data.comments }).then((res) => {
        setFetchedCommentsData(res.data)
      })
    } else {
      setFetchedCommentsData([])
    }
  }, [data?.comments])

  useEffect(() => {
    if (allInternalUsers && fetchedCommentsData) {
      const assignedUsers = data.assigned_users.map((uuid) => {
        const findUser = allInternalUsers.find((user) => user.uuid == uuid)
        return findUser
      })
      setTaskData({
        ...taskData,
        assigned_users: assignedUsers,
        comments: fetchedCommentsData,
      })
      setLoadInternalUsers(false)
      setCommentsLoading(false)
    }
  }, [fetchedCommentsData, allInternalUsers])

  // TASK FUNCTIONS
  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setTaskData({ ...taskData, status: newStatus })
  }

  const handleChangeTaskData = (field, value) => {
    setTaskData({ ...taskData, [field]: value })
  }

  // COMMENTS FUNCTIONS
  const handleAddComment = () => {
    let taskDataComments = JSON.parse(JSON.stringify(taskData.comments))
    taskDataComments.push({
      uuid: uuidv4(),
      message: addNewComment,
      created_date: new Date().toISOString(),
      owner: userData.uuid,
      tagged_users: [],
    })
    setTaskData({ ...taskData, comments: taskDataComments })
    setAddNewComment('')
  }

  const handleDeleteComment = (index) => {
    let taskDataComments = JSON.parse(JSON.stringify(taskData.comments))
    taskDataComments.splice(index, 1)
    setTaskData({ ...taskData, comments: taskDataComments })
  }

  const handleChangeCommentData = (value) => {
    setAddNewComment(value)
  }

  // FILES FUNCTION
  const formatFileName = (fileName) => {
    if (!fileName) return null
    return fileName.toLowerCase().trim().split(' ').join('-')
  }

  const handleAddFiles = (type, e) => {
    const files = e.target.files
    const totalfiles = Object.keys(e.target.files).map((key) => {
      return files[key]
    })
    console.log('surath 1', {
      ...taskData,
      [[type]]: [...taskData[[type]], ...totalfiles],
    })
    setTaskData({
      ...taskData,
      [[type]]: [...taskData[[type]], ...totalfiles],
    })
  }

  const handleRemoveFiles = (type, index) => {
    let files = JSON.parse(JSON.stringify(taskData[[type]]))
    files.splice(index, 1)
    console.log('surath 2', { ...taskData, [[type]]: files })
    setTaskData({ ...taskData, [[type]]: files })
  }

  // SAVE TASK
  const handleSaveTask = async () => {
    console.log(taskData)
    console.log(data)
    setTaskSaving(true)

    // FILES CONFIGURATION
    const addNew_TaskFiles = []
    const delete_TaskFiles = [...data.task_files] ?? []

    const taskDataFiles = [...taskData.task_files]
    taskDataFiles.map((file) => {
      if (file?.name) {
        addNew_TaskFiles.push(file)
      } else {
        const findFileIndex = delete_TaskFiles.findIndex((fileName) => fileName == file)
        if (findFileIndex != -1) {
          delete_TaskFiles.splice(findFileIndex, 1)
        }
      }
    })

    const addNew_TaskSolutions = []
    const delete_TaskSolutions = [...data.task_solutions] ?? []

    let taskDataSolutions = [...taskData.task_solutions]
    taskDataSolutions.map((file) => {
      if (file?.name) {
        addNew_TaskSolutions.push(file)
      } else {
        const findFileIndex = delete_TaskSolutions.findIndex((fileName) => fileName == file)
        if (findFileIndex != -1) {
          delete_TaskSolutions.splice(findFileIndex, 1)
        }
      }
    })
    console.log(delete_TaskFiles, delete_TaskSolutions)
    console.log(addNew_TaskFiles, addNew_TaskSolutions)

    // CREATE AND DELETE FILES CALL
    if (delete_TaskFiles.length > 0) {
      filesService.deleteFiles({ files: delete_TaskFiles }).then((res) => {
        console.log('files deleted successfully', res)
      })
    }
    if (delete_TaskSolutions.length > 0) {
      filesService.deleteFiles({ files: delete_TaskSolutions }).then((res) => {
        console.log('files deleted successfully', res)
      })
    }
    if (addNew_TaskFiles.length > 0) {
      const formData = new FormData()
      addNew_TaskFiles.forEach((file) => {
        formData.append('files', file)
      })
      const res = await filesService.uploadFiles(formData)
    }
    if (addNew_TaskSolutions.length > 0) {
      const formData = new FormData()
      addNew_TaskSolutions.forEach((file) => {
        formData.append('files', file)
      })
      const res = await filesService.uploadFiles(formData)
    }

    // COMMENT CONFIGURATION
    const createComments = []
    const deleteComments = data.comments ?? []

    taskData.comments?.map((item) => {
      if (item._id) {
        const findCommentIndex = deleteComments.findIndex((uuid) => uuid == item.uuid)
        if (findCommentIndex != -1) {
          deleteComments.splice(findCommentIndex, 1)
        }
      } else {
        createComments.push(item)
      }
    })

    // CREATE COMMENT & DELETE COMMENT CALLS
    if (createComments.length > 0) {
      commentService.createComment({ comments: createComments }).then((res) => {})
    }

    if (deleteComments.length > 0) {
      commentService.deleteComment({ comments: deleteComments }).then((res) => {})
    }

    // ASSIGN USERS CONFIGURATION
    const assignNewUsers = []
    const deleteNotAssignUsers = data.assigned_users

    // ASSIGN USERS & REMOVE USERS CALLS
    if (userData?.role == 'Admin' && taskData.assigned_users != data.assigned_users) {
      taskData.assigned_users?.forEach((item) => {
        const findUserIndex = deleteNotAssignUsers.findIndex((uuid) => uuid == item.uuid)
        if (findUserIndex != -1) {
          deleteNotAssignUsers.splice(findUserIndex, 1)
        } else {
          assignNewUsers.push(item)
        }
      })

      console.log('dlete not assign users', deleteNotAssignUsers)
      deleteNotAssignUsers.forEach((userUUID) => {
        const userAllInfo = allInternalUsers.find((user) => user.uuid == userUUID)
        const assigned_tasks = userAllInfo.assigned_tasks
        const findTaskIndex = assigned_tasks.findIndex((taskUUID) => taskUUID == taskData.uuid)
        assigned_tasks.splice(findTaskIndex, 1)
        internalUserService
          .updateAdminUser(userUUID, {
            assigned_tasks: assigned_tasks,
          })
          .then((res) => {
            if (res.data.uuid == userData.uuid) {
              setUserData({ ...userData, assigned_tasks: assigned_tasks })
            }
          })
      })

      assignNewUsers.forEach((assignUser) => {
        internalUserService
          .updateAdminUser(assignUser.uuid, {
            assigned_tasks: [...assignUser.assigned_tasks, taskData.uuid],
          })
          .then((res) => {
            if (res.data.uuid == userData.uuid) {
              setUserData({
                ...userData,
                assigned_tasks: [userData.assigned_tasks, taskData.uuid],
              })
            }
          })
      })
    }

    // UPDATE TASK
    const getCommentsUUID = taskData.comments?.map((item) => item?.uuid)
    const getAssignUsersUUID = taskData.assigned_users?.map((item) => item?.uuid || item)
    const getTaskFiles = taskData.task_files?.map((file) => {
      const fileName = formatFileName(file.name) || file
      return fileName
    })
    const getTaskSoution = taskData.task_solutions?.map((file) => {
      const fileName = formatFileName(file.name) || file
      return fileName
    })

    const updatedTaskData = {
      ...taskData,
      comments: getCommentsUUID ?? [],
      assigned_users: getAssignUsersUUID ?? [],
      task_files: getTaskFiles ?? [],
      task_solutions: getTaskSoution ?? [],
      due_date: new Date(taskData.due_date).toISOString(),
    }

    console.log(updatedTaskData)

    taskService.updateTask(updatedTaskData.uuid, updatedTaskData).then((res) => {
      if (res.data) {
        setTaskSaving(false)
        UpdatedTask(updatedTaskData)
        handleShowTaskModal(false)
        toast.success('Task updated successfully')
      } else {
        toast.error('Due to some reason the task was not updated')
      }
    })
  }

  const formatDate = (date) => {
    let newDate = new Date(date)
    return `${newDate.toLocaleString('en-US', {
      month: 'short',
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })}`
  }

  const getCommentName = (ownerUUID) => {
    let getName = ''
    if (allInternalUsers?.length > 0) {
      const userInfo = allInternalUsers.find((user) => user.uuid == ownerUUID)
      getName = userInfo?.name ?? ''
    }
    if (getName == '' && allCustomers?.length > 0) {
      const userInfo = allCustomers.find((user) => user.uuid == ownerUUID)
      getName = userInfo?.name ?? ''
    }
    return getName
  }
  console.log(taskData)
  console.log(allInternalUsers)

  return (
    <CModal
      alignment="center"
      scrollable
      visible={show}
      onClose={() => handleShowTaskModal(false)}
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>Task Info</CModalTitle>
      </CModalHeader>
      <CModalBody style={{ padding: '4% 10%' }}>
        <CRow className="mb-4">
          <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
            Name
          </CFormLabel>
          <CCol sm={10}>
            <CFormInput
              type="text"
              id="staticEmail"
              placeholder="Enter your task name"
              onChange={(e) => handleChangeTaskData('name', e.target.value)}
              value={taskData.name}
            />
          </CCol>
        </CRow>

        <CRow className="mb-4">
          <CFormLabel className="col-sm-2 col-form-label">Description</CFormLabel>
          <CCol sm={10}>
            <CFormTextarea
              id="exampleFormControlTextarea1"
              label="Example textarea"
              rows="3"
              text="Must be 8-20 words long."
              onChange={(e) => handleChangeTaskData('description', e.target.value)}
              value={taskData.description}
            ></CFormTextarea>
          </CCol>
        </CRow>

        {userData?.role == 'Admin' && (
          <CRow className="mb-4">
            <CFormLabel className="col-sm-2 col-form-label">Assignee</CFormLabel>
            <CCol sm={10}>
              {loadInternalUsers ? (
                <CSpinner />
              ) : (
                <Select
                  value={taskData.assigned_users}
                  closeMenuOnSelect={false}
                  isMulti
                  onChange={(selectedOption) =>
                    handleChangeTaskData('assigned_users', selectedOption)
                  }
                  options={allInternalUsers.filter((user) => user.uuid !== taskData.owner)}
                  components={animatedComponents}
                />
              )}
            </CCol>
          </CRow>
        )}

        {userData?.role == 'Admin' && (
          <CRow className="mb-4">
            <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
            <CCol sm={10}>
              <CFormSelect value={taskData.status} onChange={handleStatusChange}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </CFormSelect>
            </CCol>
          </CRow>
        )}

        <CRow className="mb-4">
          <CFormLabel className="col-sm-2 col-form-label">Due Date</CFormLabel>
          <CCol sm={10} style={{ margin: 'auto' }}>
            <DatePicker
              selected={taskData.due_date}
              onChange={(date) => handleChangeTaskData('due_date', date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              wrapperClassName="taskPageDatePicker"
            />
          </CCol>
        </CRow>

        {userData?.role != 'Expert' && (
          <CRow className="mb-4">
            <CFormLabel className="col-sm-2 col-form-label">Price</CFormLabel>
            <CCol sm={10}>
              <CFormInput
                type="text"
                placeholder="Enter the price for your task in your own currency"
                onChange={(e) => handleChangeTaskData('price', e.target.value)}
                value={taskData.price}
                color="#2c384a"
              />
            </CCol>
          </CRow>
        )}

        <CRow className="mb-4">
          <CFormLabel className="col-sm-2 col-form-label">Task Files</CFormLabel>
          <CCol sm={10} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <CFormInput
              type="file"
              id="formFile1"
              label="Default file input example"
              disabled={userData.role == 'Expert'}
              multiple
              onChange={(e) => handleAddFiles('task_files', e)}
              value={''}
            />
            {/* Already uploaded file will be just name and new upload files will be object  */}
            {taskData.task_files?.map((file, index) => (
              <div style={{ display: 'flex' }} key={index}>
                <CButton
                  color="light"
                  shape="rounded-0"
                  href={file.name ? '#' : process.env.REACT_APP_IMAGE_PATH + file}
                  target="_blank"
                  style={{ width: '90%', overflow: 'hidden', fontSize: '12px' }}
                >
                  {formatFileName(file.name) || file}
                </CButton>
                <CButton
                  color="danger"
                  shape="rounded-0"
                  disabled={userData.role == 'Expert'}
                  onClick={() => handleRemoveFiles('task_files', index)}
                >
                  <ImCross size={15} color="white" />
                </CButton>
              </div>
            ))}
          </CCol>
        </CRow>

        {(taskData.task_solutions || userData.role) && (
          <CRow className="mb-2">
            <CFormLabel className="col-sm-2 col-form-label">Task Solution</CFormLabel>
            <CCol sm={10} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <CFormInput
                type="file"
                id="formFile2"
                label="Default file input example"
                disabled={!userData.role}
                multiple
                onChange={(e) => handleAddFiles('task_solutions', e)}
                value={''}
              />
              {/* Already uploaded file will be just name and new upload files will be object  */}
              {taskData.task_solutions?.map((file, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <CButton
                    color="light"
                    shape="rounded-0"
                    href={file.name ? '#' : process.env.REACT_APP_IMAGE_PATH + file}
                    target="_blank"
                    style={{
                      width: '90%',
                      overflow: 'hidden',
                      fontSize: '12px',
                    }}
                  >
                    {formatFileName(file.name) || file}
                  </CButton>
                  <CButton
                    color="danger"
                    shape="rounded-0"
                    onClick={() => handleRemoveFiles('task_solutions', index)}
                  >
                    <ImCross size={15} color="white" />
                  </CButton>
                </div>
              ))}
            </CCol>
          </CRow>
        )}

        <hr />

        <CRow className="mb-2 taskInfoCommentHeader">
          <CFormLabel className="col-sm-2 col-form-label">Comments:</CFormLabel>
        </CRow>

        {/* MAPPING COMMENTS  */}

        {commentsLoading ? (
          <CSpinner color="secondary" style={{ margin: '1rem auto' }} />
        ) : (
          taskData?.comments?.map((item, index) => (
            <CRow className="mb-3 taskInfoCommentContent" key={index}>
              <CAvatar
                src={process.env.REACT_APP_DEFAULT_PROFILE_PIC}
                size="md"
                className="taskInfoCommentAvatar"
              />
              <CCol sm={10} className="taskInfoCommentBox">
                <h4>{getCommentName(item.owner)}</h4>
                <span>{formatDate(item.created_date)}</span>
                <CFormTextarea
                  id="exampleFormControlTextarea1"
                  label="Example textarea"
                  rows="2"
                  text="Must be 8-20 words long. adsbjfds adsjbfhdsf dsbhfbaj"
                  // onChange={(e) => handleChangeTaskComments('', e.target.value)}
                  value={item.message}
                  disabled
                ></CFormTextarea>
                {(userData.uuid == item.owner || userData.role == 'Admin') && (
                  <CButton
                    color="danger"
                    variant="outline"
                    className="taskInfoCommentDelete"
                    onClick={() => handleDeleteComment(index)}
                  >
                    Delete
                    <MdDelete size={19} />
                  </CButton>
                )}
              </CCol>
            </CRow>
          ))
        )}

        <hr />

        <CRow className="">
          <CCol>
            <CFormTextarea
              id="exampleFormControlTextarea1"
              label="Example textarea"
              rows="2"
              text="Must be 8-20 words long. adsbjfds adsjbfhdsf dsbhfbaj"
              onChange={(e) => handleChangeCommentData(e.target.value)}
              value={addNewComment}
              placeholder="Write your comment"
            ></CFormTextarea>
            <CButton
              color="success"
              variant="outline"
              className="taskInfoCommentPost"
              onClick={handleAddComment}
            >
              Comment
              <IoMdSend size={19} />
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        {taskSaving ? (
          <CButton color="primary">
            Saving Changes
            <CSpinner style={{ marginLeft: '0.3rem', width: '20px', height: '20px' }} />
          </CButton>
        ) : (
          <CButton color="primary" onClick={handleSaveTask}>
            Save Changes
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default UpdateTask
