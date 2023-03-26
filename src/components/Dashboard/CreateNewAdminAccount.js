import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilMobile, cilShieldAlt, cilUser } from '@coreui/icons'
import internalUserService from '../../services/internalUserService'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import PropTypes from 'prop-types'

const CreateNewAdminAccount = ({ addNewUser }) => {
  CreateNewAdminAccount.propTypes = {
    addNewUser: PropTypes.node.isRequired,
  }
  const [userInputData, setUserInputData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: '',
  })

  const handleSignUp = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (
      userInputData.name == '' &&
      userInputData.email == '' &&
      userInputData.mobileNumber == '' &&
      userInputData.password == '' &&
      userInputData.role == ''
    ) {
      toast.error('Please fill all the details')
      return
    }
    if (regex.test(userInputData.email) === false) {
      toast.error('Please enter your email address correctly')
      return
    }
    if (userInputData.password.length < 6) {
      toast.error('Minimum length of password should be 6')
      return
    }
    internalUserService
      .adminSignup({
        uuid: uuidv4(),
        name: userInputData.name,
        mobileNumber: userInputData.mobileNumber,
        email: userInputData.email,
        password: userInputData.password,
        role: userInputData.role,
      })
      .then((res) => {
        console.log(res)
        if (res.data) {
          if (res.data.userExist) {
            toast.error('User already registered with that email')
          } else {
            toast.success('Account has been created successfully')
            setUserInputData({
              name: '',
              email: '',
              password: '',
              mobileNumber: '',
              role: '',
            })
            addNewUser(res.data)
          }
        }
      })
  }

  const handleInputChange = (e, type) => {
    const value = e.target.value
    setUserInputData({ ...userInputData, [type]: value })
  }
  return (
    <CCard style={{ border: 'none' }}>
      <CCardBody style={{ width: '70%', margin: 'auto', padding: 0 }}>
        <CForm>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              placeholder="Name"
              autoComplete="name"
              onChange={(e) => handleInputChange(e, 'name')}
              value={userInputData.name}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilMobile} />
            </CInputGroupText>
            <CFormInput
              placeholder="Mobile Number"
              type="number"
              autoComplete="mobile"
              onChange={(e) => handleInputChange(e, 'mobileNumber')}
              value={userInputData.mobileNumber}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>@</CInputGroupText>
            <CFormInput
              placeholder="Email"
              autoComplete="email"
              onChange={(e) => handleInputChange(e, 'email')}
              value={userInputData.email}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              onChange={(e) => handleInputChange(e, 'password')}
              value={userInputData.password}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilShieldAlt} />
            </CInputGroupText>
            <CFormSelect
              onChange={(e) => handleInputChange(e, 'role')}
              value={userInputData.role}
              aria-label="Choose role"
            >
              <option value="">Choose role</option>
              <option value="Expert">Expert</option>
              <option value="Admin">Admin</option>
            </CFormSelect>
          </CInputGroup>
          <div className="d-grid">
            <CButton color="success" style={{ color: 'white' }} onClick={handleSignUp}>
              Create Account
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default CreateNewAdminAccount
