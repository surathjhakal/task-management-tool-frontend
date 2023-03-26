import React, { useEffect, useState } from 'react'
import customerService from '../../services/customerService'
import internalUserService from '../../services/internalUserService'
import taskService from '../../services/taskService'
import WidgetsBottom from './WidgetsBottom'
import WidgetsHeader from './WidgetsHeader'

const Dashboard = () => {
  const [allData, setAllData] = useState({
    customers: null,
    internalUsers: null,
    tasks: null,
  })
  const [optionSelected, setOptionSelected] = useState('customers')

  const checkDataFetched = (tempData) => {
    let check = Object.keys(tempData).filter((key) => tempData[key] == null)
    if (check?.length == 0) {
      return true
    }
    return false
  }

  const handleAddNewUser = (newUser) => {
    setAllData({
      ...allData,
      internalUsers: [...allData.internalUsers, newUser],
    })
  }

  const handleUpdateTaskData = (updatedTask) => {
    const index = allData['tasks'].findIndex((item) => item.uuid == updatedTask.uuid)
    const tempAllTasksData = JSON.parse(JSON.stringify(allData['tasks']))
    tempAllTasksData.splice(index, 1)
    tempAllTasksData.splice(index, 0, updatedTask)
    console.log(tempAllTasksData, updatedTask)
    setAllData({ ...allData, tasks: tempAllTasksData })
  }

  useEffect(() => {
    let tempData = { customers: null, internalUsers: null, tasks: null }
    customerService.getAllCustomers().then((res) => {
      tempData = { ...tempData, customers: res.data }
      if (checkDataFetched(tempData)) {
        setAllData(tempData)
      }
    })
    internalUserService.getAllUsers().then((res) => {
      tempData = { ...tempData, internalUsers: res.data }
      if (checkDataFetched(tempData)) {
        setAllData(tempData)
      }
    })
    taskService.getAllTasks().then((res) => {
      tempData = { ...tempData, tasks: res.data }
      if (checkDataFetched(tempData)) {
        setAllData(tempData)
      }
    })
  }, [])

  return (
    <>
      <WidgetsHeader
        setOptionSelected={setOptionSelected}
        optionSelected={optionSelected}
        allData={allData}
      />

      {/* <WidgetsBrand withCharts /> */}
      {(optionSelected == 'createAccount' || allData[optionSelected]) && (
        <WidgetsBottom
          data={allData[[optionSelected]]}
          optionSelected={optionSelected}
          addNewUser={handleAddNewUser}
          totalUsers={[...allData['customers'], ...allData['internalUsers']]}
          UpdatedTask={handleUpdateTaskData}
        />
      )}
    </>
  )
}

export default Dashboard
