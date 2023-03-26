import React from 'react'
import { CRow, CCol, CWidgetStatsA, CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'

const WidgetsHeader = ({ optionSelected, setOptionSelected, allData }) => {
  WidgetsHeader.propTypes = {
    optionSelected: PropTypes.node.isRequired,
    setOptionSelected: PropTypes.node.isRequired,
    allData: PropTypes.node.isRequired,
  }

  const handleDashboardOptionChange = (value) => {
    setOptionSelected(value)
  }
  console.log(allData)
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          color="primary"
          value={allData.customers?.length ?? <CSpinner />}
          title="Customers"
          className={`mb-4 dashboard-title ${optionSelected == 'customers' && 'showSelected'}`}
          onClick={() => handleDashboardOptionChange('customers')}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          color="info"
          value={allData.internalUsers?.length ?? <CSpinner />}
          title="Internal Users"
          className={`mb-4 dashboard-title ${optionSelected == 'internalUsers' && 'showSelected'}`}
          onClick={() => handleDashboardOptionChange('internalUsers')}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          color="warning"
          value={allData.tasks?.length ?? <CSpinner />}
          title="Total Tasks"
          className={`mb-4 dashboard-title ${optionSelected == 'tasks' && 'showSelected'}`}
          onClick={() => handleDashboardOptionChange('tasks')}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          color="danger"
          value={'Admin Account'}
          title="Create New Profile"
          className={`mb-4 dashboard-title ${optionSelected == 'createAccount' && 'showSelected'}`}
          onClick={() => handleDashboardOptionChange('createAccount')}
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsHeader
