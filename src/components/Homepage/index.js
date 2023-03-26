import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import './Homepage.css'
import { SiWheniwork } from 'react-icons/si'
import CreateTask from '../CreateTask'
import HeaderContext from '../../HeaderContext'
import UpdateTask from '../UpdateTask'
import taskService from '../../services/taskService'

const Homepage = () => {
  const { userData } = useContext(HeaderContext)
  const [showTaskType, setTaskType] = useState('All')
  const [show, setShow] = useState(false)
  const [loadRecentTask, setLoadRecentTask] = useState(false)
  const [allRecentTasks, setAllRecentTasks] = useState([])
  const [allTasksForRoleExpert, setAllTasksForRoleExpert] = useState(null)
  const [taskCompletedCount, setTaskCompletedCount] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const currentDate = new Date()

  useEffect(() => {
    console.log(allTasksForRoleExpert)
    if (userData.role == 'Expert' && allTasksForRoleExpert) {
      if (showTaskType == 'All') {
        setAllRecentTasks(allTasksForRoleExpert)
      } else {
        const statusTasks = allTasksForRoleExpert.filter((task) => task.status == showTaskType)
        setAllRecentTasks(statusTasks)
      }
    } else {
      setLoadRecentTask(true)
      taskService.getRecent5Tasks(userData.uuid, showTaskType).then((res) => {
        console.log(res)
        setAllRecentTasks(res.data ?? [])
        setLoadRecentTask(false)
      })
    }
  }, [showTaskType])

  useEffect(() => {
    if (userData.role == 'Expert' || userData.role == 'Admin') {
      taskService.getAllUUIDTasks(userData.assigned_tasks).then((res) => {
        console.log('res', res)
        const totalTasks = res.data
        setAllTasksForRoleExpert(totalTasks)
        const completedTaskLength = totalTasks.filter((task) => task.status == 'Completed')
        console.log(completedTaskLength)
        setTaskCompletedCount(completedTaskLength.length)
        setAllRecentTasks(totalTasks)
      })
    } else {
      taskService.getCompletedTaskLength(userData.uuid).then((res) => {
        console.log('res', res)
        setTaskCompletedCount(res.data.length)
      })
    }
  }, [])

  const handleShowTaskModal = (value) => {
    setShow(value)
  }

  const getStatusColor = (status) => {
    if (status == 'Pending') return '#2b2b2b'
    return '#ffffff'
  }
  const getStatusBackground = (status) => {
    if (status == 'Completed') return 'orange'
    if (status == 'Cancelled') return 'red'
    if (status == 'Delivered') return '#069306'
    if (status == 'Pending') return 'yellow'
  }

  const createdNewTask = (newTask) => {
    console.log(allRecentTasks)
    setAllRecentTasks([...allRecentTasks, newTask])
  }

  const getName = (type, number) => {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if (type == 'month') {
      return month[number]
    } else if (type == 'day') {
      return day[number]
    }
  }

  const timeOfDay = (hour) => {
    if (hour >= 4 && hour <= 11) return 'morning'
    if (hour >= 12 && hour <= 16) return 'afternoon'
    if (hour >= 17 && hour <= 20) return 'evening'
    if (hour >= 21 || hour <= 3) return 'night'
  }

  const closeModal = () => {
    setSelectedTask(null)
  }

  const handleUpdateTaskData = (updatedTask) => {
    const index = allRecentTasks.findIndex((item) => item.uuid == updatedTask.uuid)
    const tempAllTasksData = JSON.parse(JSON.stringify(allRecentTasks))
    tempAllTasksData.splice(index, 1)
    tempAllTasksData.splice(index, 0, updatedTask)
    console.log(tempAllTasksData, updatedTask)
    setAllRecentTasks(tempAllTasksData)
  }

  const handleSelectTask = (task) => {
    setSelectedTask(task)
  }

  return (
    <div className="Homepage">
      {/* BASIC INFO */}

      <div className="HomepageSection1">
        <h4>{`${getName('day', currentDate.getDay())}, ${getName(
          'month',
          currentDate.getMonth() + 1,
        )} ${currentDate.getDate()}`}</h4>
        <h2>
          Good {timeOfDay(currentDate.getHours())}, {userData.name}
        </h2>
        <div className="HomepageSection1Filter">
          <CDropdown>
            <CDropdownToggle color="secondary">week</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>month</CDropdownItem>
              <CDropdownItem>year</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <div style={{ borderLeft: '2px solid #8a8a8a', height: '2rem' }}></div>
          <span> {taskCompletedCount} tasks completed</span>
        </div>
      </div>
      <div className="HomepageSection2">
        <div className="HomepageSection2Header">
          <div className="HomepageSection2HeaderTitle">
            <SiWheniwork className="icon" />
            <span>My Recent Tasks</span>
          </div>
          <div className="HomepageSection2HeaderButtons">
            <span
              className={showTaskType == 'All' && 'showBottomBorder'}
              onClick={() => setTaskType('All')}
            >
              All
            </span>
            <span
              className={showTaskType == 'Pending' && 'showBottomBorder'}
              onClick={() => setTaskType('Pending')}
            >
              Pending
            </span>
            <span
              className={showTaskType == 'Completed' && 'showBottomBorder'}
              onClick={() => setTaskType('Completed')}
            >
              Completed
            </span>
            <span
              className={showTaskType == 'Delivered' && 'showBottomBorder'}
              onClick={() => setTaskType('Delivered')}
            >
              Delivered
            </span>
            <span
              className={showTaskType == 'Cancelled' && 'showBottomBorder'}
              onClick={() => setTaskType('Cancelled')}
            >
              Cancelled
            </span>
          </div>
          {userData.role != 'Expert' && (
            <button className="HomepageCreateTaskOption" onClick={() => handleShowTaskModal(true)}>
              Create Task
            </button>
          )}
        </div>
        <div className="divider"></div>

        <CListGroup className="HomepageSection2Bottom">
          {loadRecentTask ? (
            <CSpinner color="secondary" style={{ margin: '1rem auto' }} />
          ) : (
            allRecentTasks.map((task, index) => (
              <CListGroupItem
                component="a"
                key={index}
                className="HomepageSection2BottomListItems"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectTask(task)}
              >
                {task.name}
                <span
                  style={{
                    background: getStatusBackground(task.status),
                    color: getStatusColor(task.status),
                  }}
                >
                  {task.status}
                </span>
              </CListGroupItem>
            ))
          )}
        </CListGroup>
      </div>
      {show && (
        <CreateTask
          show={show}
          handleShowTaskModal={handleShowTaskModal}
          createdNewTask={createdNewTask}
        />
      )}
      {selectedTask && (
        <UpdateTask
          data={selectedTask}
          show={true}
          handleShowTaskModal={closeModal}
          UpdatedTask={handleUpdateTaskData}
        />
      )}
    </div>
  )
}

export default Homepage
