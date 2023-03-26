import React, { useContext } from 'react'
import { FaFacebookF } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineGithub } from 'react-icons/ai'
import { useState } from 'react'
import HeaderContext from '../../HeaderContext'
import { toast } from 'react-toastify'
import { CButton, CSpinner } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import customerService from '../../services/customerService'
import { v4 as uuidv4 } from 'uuid'

export const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { userData, setUserData } = useContext(HeaderContext)
  const [loading, setLoading] = useState(false)

  const [userInputData, setUserInputData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
  })

  const handleSignUp = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (
      userInputData.name == '' ||
      userInputData.email == '' ||
      userInputData.mobileNumber == '' ||
      userInputData.password == ''
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
    setLoading(true)
    customerService
      .customerSignup({
        uuid: uuidv4(),
        name: userInputData.name,
        mobileNumber: userInputData.mobileNumber,
        email: userInputData.email,
        password: userInputData.password,
      })
      .then((res) => {
        console.log(res)
        if (res.data) {
          if (res.data.userExist) {
            toast.error('User already registered with that email')
          } else {
            setLoading(false)
            toast.success('Your account has been successfully registered now login')
          }
          navigate('/login')
        }
      })
  }

  const handleInputChange = (e, type) => {
    const value = e.target.value
    setUserInputData({ ...userInputData, [type]: value })
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="LoginDiv">
      <div className="LoginDivTitle">DUWORK</div>
      <div className="LoginMainDiv">
        <h4 className="LoginHeader">Sign Up</h4>
        <p className="LoginInfo">Enter the below fields to signup</p>

        <div className="LoginFields">
          <p className="LoginFieldsHeader">Name</p>
          <input
            className="LoginInputFields"
            name="name"
            value={userInputData.name}
            onChange={(e) => handleInputChange(e, 'name')}
          />
        </div>

        <div className="LoginFields">
          <p className="LoginFieldsHeader">Mobile No</p>
          <input
            className="LoginInputFields"
            type="number"
            name="mobileNumber"
            value={userInputData.mobileNumber}
            onChange={(e) => handleInputChange(e, 'mobileNumber')}
          />
        </div>

        <div className="LoginFields">
          <p className="LoginFieldsHeader">Email Address</p>
          <input
            className="LoginInputFields"
            name="email"
            value={userInputData.email}
            onChange={(e) => handleInputChange(e, 'email')}
          />
        </div>

        <div className="LoginFields">
          <p className="LoginFieldsHeader">Password</p>
          <input
            className="LoginInputFields"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={userInputData.password}
            onChange={(e) => handleInputChange(e, 'password')}
          />
          <span onClick={handleShowPassword}>{showPassword ? 'Hide' : 'Show'}</span>
        </div>
        <CButton onClick={handleSignUp} className="LoginButton" color="success">
          Sign Up
          {loading && <CSpinner />}
        </CButton>
        <div className="LoginOtherMethodLine centerItems">
          <h3>Or Sign up with</h3>
          <div></div>
        </div>
        <div className="LoginOtherMethodButtons centerItems">
          <div>
            <FaFacebookF />
          </div>
          <div>
            <FcGoogle />
          </div>
          <div>
            <AiOutlineGithub />
          </div>
        </div>
        <div className="LoginAccountExistOrNot">
          Already have a account? <Link to="/login"> Click Here</Link>
        </div>
      </div>
    </div>
  )
}
