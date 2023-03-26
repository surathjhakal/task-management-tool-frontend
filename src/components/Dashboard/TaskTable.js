import React, { useState } from 'react'

import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import UpdateTask from '../UpdateTask'

const TaskTable = ({ data, totalUsers, UpdatedTask }) => {
  TaskTable.propTypes = {
    data: PropTypes.node.isRequired,
    totalUsers: PropTypes.node.isRequired,
    UpdatedTask: PropTypes.node.isRequired,
  }
  const [selectedTask, setSelectedTask] = useState(null)

  const formatDate = (date) => {
    let newDate = new Date(date)
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  }

  const getOwner = (ownerUUID) => {
    console.log(totalUsers)
    const getUser = totalUsers.find((user) => user.uuid == ownerUUID)
    return getUser?.name
  }

  const closeModal = () => {
    setSelectedTask(null)
  }

  const handleSelectTask = (task) => {
    setSelectedTask(task)
  }

  return (
    <>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center">#</CTableHeaderCell>
            <CTableHeaderCell>Task Name</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Owner</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((task, index) => (
            <CTableRow
              v-for="task in tableItems"
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelectTask(task)}
            >
              <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{task.name}</CTableDataCell>
              <CTableDataCell>{task.price}</CTableDataCell>
              <CTableDataCell>{getOwner(task.owner)}</CTableDataCell>
              <CTableDataCell>{task.status}</CTableDataCell>
              <CTableDataCell>{formatDate(task.created_date)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {selectedTask && (
        <UpdateTask
          data={selectedTask}
          show={true}
          handleShowTaskModal={closeModal}
          calledFrom={'Dashboard'}
          UpdatedTask={UpdatedTask}
        />
      )}
    </>
  )
}

export default TaskTable
