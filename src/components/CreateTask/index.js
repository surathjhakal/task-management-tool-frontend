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
import DatePicker from 'react-datepicker'
import { MdDelete } from 'react-icons/md'
import { IoMdSend } from 'react-icons/io'
import HeaderContext from '../../HeaderContext'
import taskService from '../../services/taskService'
import { v4 as uuidv4 } from 'uuid'
import commentService from '../../services/commentService'
import internalUserService from '../../services/internalUserService'
import customerService from '../../services/customerService'
import { toast } from 'react-toastify'
import filesService from '../../services/filesService'
import { ImCross } from 'react-icons/im'

const CreateTask = ({ show, handleShowTaskModal, createdNewTask }) => {
  CreateTask.propTypes = {
    show: PropTypes.node.isRequired,
    handleShowTaskModal: PropTypes.node.isRequired,
    createdNewTask: PropTypes.node.isRequired,
  }

  const { userData, setUserData } = useContext(HeaderContext)
  const [taskData, setTaskData] = useState({
    uuid: uuidv4(),
    name: '',
    description: '',
    price: '',
    due_date: '',
    status: 'Pending',
    assigned_users: [],
    comments: [],
    task_files: [],
    task_solutions: [],
    owner: userData.uuid,
  })
  const [addNewComment, setAddNewComment] = useState('')
  const [taskCreating, setTaskCreating] = useState(false)

  // TASK FUNCTIONS
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
    return fileName.toLowerCase().trim().split(' ').join('-')
  }

  const handleAddFiles = (type, e) => {
    const files = e.target.files
    const totalfiles = Object.keys(e.target.files).map((key) => {
      return files[key]
    })
    console.log(totalfiles)
    setTaskData({
      ...taskData,
      [[type]]: [...taskData[[type]], ...totalfiles],
    })
  }

  const handleRemoveFiles = (type, index) => {
    let files = JSON.parse(JSON.stringify(taskData[[type]]))
    files.splice(index, 1)
    setTaskData({ ...taskData, [[type]]: files })
  }

  // CREATE TASK
  const handleCreateTask = async () => {
    console.log(taskData)
    setTaskCreating(true)
    if (taskData.name.trim() == '') return toast.error('Enter task name')
    if (taskData.due_date == '') return toast.error('Enter task due_date')
    if (taskData.price.trim() == '') return toast.error('Enter task price')
    const getCommentsUUID = taskData.comments.map((item) => item.uuid)
    // const getAssignUsersUUID = taskData.assigned_users.map((item) => item.uuid)
    const getTaskFiles = taskData.task_files.map((file) => {
      return formatFileName(file.name)
    })

    // Uploading files
    if (taskData.task_files.length > 0) {
      const formData = new FormData()
      taskData.task_files.forEach((file) => {
        formData.append('files', file)
      })
      console.log(formData)
      const res = await filesService.uploadFiles(formData)
      console.log(res)
    }

    // Creating comments at backend and storing their uuid in that task
    if (taskData.comments.length > 0) {
      commentService.createComment({ comments: taskData.comments }).then((res) => {
        console.log(res)
      })
    }

    // updating user info
    if (userData.role) {
      // let check = false
      // taskData.assigned_users.map((user) => {
      //   if (user.uuid == userData.uuid) {
      //     check = true
      //   } else {
      //     internalUserService.updateAdminUser(user.uuid, {
      //       assigned_tasks: [...user.assigned_tasks, taskData.uuid],
      //     })
      //   }
      // })
      internalUserService.updateAdminUser(userData.uuid, {
        tasks_created: [...userData.tasks_created, taskData.uuid],
        // assigned_tasks: check
        //   ? [...userData.assigned_tasks, taskData.uuid]
        //   : userData.assigned_tasks,
      })
    } else {
      customerService.updateCustomer(userData.uuid, {
        tasks_created: [...userData.tasks_created, taskData.uuid],
      })
      setUserData({
        ...userData,
        tasks_created: [...userData.tasks_created, taskData.uuid],
      })
    }

    const newTask = {
      ...taskData,
      due_date: new Date(taskData.due_date).toISOString(),
      owner: userData.uuid ?? [],
      comments: getCommentsUUID ?? [],
      task_files: getTaskFiles ?? [],
    }

    // Creating Task
    taskService.createTask(newTask).then((res) => {
      console.log(res)
      if (res.data) {
        setTaskCreating(false)
        handleShowTaskModal(false)
        createdNewTask(newTask)
        toast.success('Task created successfully')
      } else {
        toast.error('Due to some reason the task was not created')
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

  return (
    <CModal
      alignment="center"
      scrollable
      visible={show}
      onClose={() => handleShowTaskModal(false)}
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>Create Task</CModalTitle>
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

        <CRow className="mb-4">
          <CFormLabel className="col-sm-2 col-form-label">Task Files</CFormLabel>
          <CCol sm={10} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <CFormInput
              type="file"
              id="formFile1"
              label="Default file input example"
              multiple
              onChange={(e) => handleAddFiles('task_files', e)}
              value={''}
            />
            {/* Already uploaded file will be just name and new upload files will be object  */}
            {taskData.task_files.map((file, index) => (
              <div style={{ display: 'flex' }} key={index}>
                <CButton
                  color="light"
                  shape="rounded-0"
                  href={'#'}
                  target="_blank"
                  style={{ width: '90%', overflow: 'hidden', fontSize: '12px' }}
                >
                  {formatFileName(file.name)}
                </CButton>
                <CButton
                  color="danger"
                  shape="rounded-0"
                  onClick={() => handleRemoveFiles('task_files', index)}
                >
                  <ImCross size={15} color="white" />
                </CButton>
              </div>
            ))}
          </CCol>
        </CRow>

        <hr />

        <CRow className="mb-2 taskInfoCommentHeader">
          <CFormLabel className="col-sm-2 col-form-label">Comments:</CFormLabel>
        </CRow>

        {/* MAPPING COMMENTS  */}

        {taskData?.comments?.map((item, index) => (
          <CRow className="mb-3 taskInfoCommentContent" key={index}>
            <CAvatar
              src={process.env.REACT_APP_DEFAULT_PROFILE_PIC}
              size="md"
              className="taskInfoCommentAvatar"
            />
            <CCol sm={10} className="taskInfoCommentBox">
              <h4>{userData?.name}</h4>
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
              <CButton
                color="danger"
                variant="outline"
                className="taskInfoCommentDelete"
                onClick={() => handleDeleteComment(index)}
              >
                Delete
                <MdDelete size={19} />
              </CButton>
            </CCol>
          </CRow>
        ))}

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
        {taskCreating ? (
          <CButton color="primary">
            Creating Task
            <CSpinner style={{ marginLeft: '0.3rem', height: '20px', width: '20px' }} />
          </CButton>
        ) : (
          <CButton color="primary" onClick={handleCreateTask}>
            Create Task
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default CreateTask
