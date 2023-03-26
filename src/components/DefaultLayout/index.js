import React, { useContext, useEffect } from 'react'
import HeaderContext from '../../HeaderContext'
import internalUserService from '../../services/internalUserService'
import { AppContent } from '../AppContent'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'

const DefaultLayout = () => {
  const { setAllInternalUsers } = useContext(HeaderContext)
  useEffect(() => {
    internalUserService.getAllUsers().then((res) => {
      console.log(res)
      setAllInternalUsers(res.data)
    })
  }, [])
  return (
    <div>
      <Sidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <Header />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default DefaultLayout
