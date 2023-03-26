import React, { useContext } from 'react'

import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cifIn, cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import PropTypes from 'prop-types'
import HeaderContext from '../../HeaderContext'

const UserTable = ({ data, optionSelected }) => {
  const { userData } = useContext(HeaderContext)
  UserTable.propTypes = {
    data: PropTypes.node.isRequired,
    optionSelected: PropTypes.node.isRequired,
  }

  return (
    <CTable align="middle" className="mb-0 border" hover responsive>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell className="text-center">
            <CIcon icon={cilPeople} />
          </CTableHeaderCell>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Phone Number</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Task Created</CTableHeaderCell>
          {optionSelected == 'internalUsers' && <CTableHeaderCell>Role</CTableHeaderCell>}
          <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.map((item, index) => (
          <CTableRow v-for="item in tableItems" key={index}>
            <CTableDataCell className="text-center">
              <CAvatar
                size="md"
                src={
                  item.profilePhoto
                    ? process.env.REACT_APP_IMAGE_PATH + item.profilePhoto
                    : process.env.REACT_APP_DEFAULT_PROFILE_PIC
                }
              />
            </CTableDataCell>
            <CTableDataCell>
              <div>{item.name}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{item.mobileNumber}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{item.email}</div>
            </CTableDataCell>
            <CTableDataCell>
              <div>{item.tasks_created.length}</div>
            </CTableDataCell>
            {optionSelected == 'internalUsers' && (
              <CTableDataCell>
                <div>{item.role}</div>
              </CTableDataCell>
            )}{' '}
            <CTableDataCell className="text-center">
              <CIcon size="xl" icon={cifIn} title={'India'} />
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default UserTable
