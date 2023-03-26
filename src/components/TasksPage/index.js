import {
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import taskService from '../../services/taskService'
import HeaderContext from '../../HeaderContext'
import UpdateTask from '../UpdateTask'
import './TasksPage.css'

const TasksPage = () => {
  const { userData } = useContext(HeaderContext)
  const [show, setShow] = useState(false)
  const [loadingAllTaskData, setLoadingAllTaskData] = useState(null)
  const [selectedTaskData, setSelectedTaskData] = useState(null)
  const [allTaskData, setAllTaskData] = useState([])

  const handleShowTaskModal = (value, task) => {
    if (value) {
      setShow(true)
      setSelectedTaskData(task)
    } else {
      setShow(false)
      setSelectedTaskData(null)
    }
  }

  useEffect(() => {
    setLoadingAllTaskData(true)
    if (userData.role == 'Expert') {
      taskService.getAllUUIDTasks(userData.assigned_tasks).then((res) => {
        console.log('res', res)
        setAllTaskData(res.data)
        setLoadingAllTaskData(false)
      })
    } else {
      taskService.getUserTasks(userData.uuid).then((res) => {
        console.log(res)
        const allTasks = res.data
        if (userData?.role && userData?.assigned_tasks?.length > 0) {
          taskService.getAllUUIDTasks(userData.assigned_tasks).then((tasks) => {
            setAllTaskData([...allTasks, ...tasks.data])
            setLoadingAllTaskData(false)
          })
        } else {
          setAllTaskData(allTasks)
          setLoadingAllTaskData(false)
        }
      })
    }
  }, [])

  const handleUpdateTaskData = (updatedTask) => {
    const index = allTaskData.findIndex((item) => item.uuid == updatedTask.uuid)
    const tempAllTasksData = JSON.parse(JSON.stringify(allTaskData))
    tempAllTasksData.splice(index, 1)
    tempAllTasksData.splice(index, 0, updatedTask)
    setAllTaskData(tempAllTasksData)
  }

  const formatDate = (date) => {
    let newDate = new Date(date)
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  }

  return (
    <div>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            {userData?.role !== 'Expert' && <CTableHeaderCell scope="col">Price</CTableHeaderCell>}
            <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingAllTaskData ? (
            <CSpinner color="secondary" style={{ margin: '1rem auto' }} />
          ) : (
            allTaskData.map((task, index) => (
              <CTableRow
                className="TaskItems"
                key={index}
                onClick={() => handleShowTaskModal(true, task)}
              >
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{task.name}</CTableDataCell>
                <CTableDataCell>{task.status}</CTableDataCell>
                {userData?.role !== 'Expert' && <CTableDataCell>{task.price}</CTableDataCell>}
                <CTableDataCell>{formatDate(task.created_date)}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
      {show && (
        <UpdateTask
          show={show}
          handleShowTaskModal={handleShowTaskModal}
          data={selectedTaskData}
          UpdatedTask={handleUpdateTaskData}
        />
      )}
    </div>
  )
}

export default TasksPage
