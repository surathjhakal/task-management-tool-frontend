import React, { Component, Suspense, useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { injectStyle } from 'react-toastify/dist/inject-style'
import 'react-datepicker/dist/react-datepicker.css'
import './scss/style.scss'
import './css/AppAccess.css'
import HeaderContext from './HeaderContext'
import { ToastContainer } from 'react-toastify'
import customerService from './services/customerService'
import internalUserService from './services/internalUserService'
import { AdminLogin } from './components/AdminLogin'
import { Login } from './components/Login'
import DefaultLayout from './components/DefaultLayout'
import { Signup } from './components/Signup'
// import jwt from 'jsonwebtoken'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const App = () => {
  const { userData, setUserData } = useContext(HeaderContext)
  const navigate = useNavigate()
  if (typeof window !== 'undefined') {
    injectStyle()
  }
  useEffect(() => {
    console.log('userData', userData)
  }, [userData])

  useEffect(() => {
    if (localStorage.getItem('userUUID') && !userData) {
      const userUUID = localStorage.getItem('userUUID')
      if (localStorage.getItem('role')) {
        internalUserService.getAdminUser(userUUID).then((res) => {
          console.log(res)
          setUserData(res.data)
          navigate('/homepage')
        })
      } else {
        customerService.getCustomer(userUUID).then((res) => {
          setUserData(res.data)
          navigate('/homepage')
        })
      }
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <Suspense fallback={loading}>
        <Routes>
          {!userData ? (
            <>
              <Route exact path="/admin/login" name="Admin Login Page" element={<AdminLogin />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/signup" name="Signup Page" element={<Signup />} />
              <Route path="*" element={<Navigate to="login" replace />} />
            </>
          ) : (
            <>
              <Route exact path="*" name="Home" element={<DefaultLayout />} />
            </>
          )}
        </Routes>
      </Suspense>
    </>
  )
}

export default App
