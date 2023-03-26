import React, { Suspense, useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import HeaderContext from '../../HeaderContext'
import AboutPage from '../AboutPage'
import Homepage from '../Homepage'
import InboxPage from '../InboxPage'
import ProfilePage from '../ProfilePage'
import TasksPage from '../TasksPage'
import Dashboard from '../Dashboard'

export const AppContent = () => {
  const { userData } = useContext(HeaderContext)
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="/dashboard" name="Dashboard" element={<Dashboard />} />
          <Route path="/homepage" name="Homepage" element={<Homepage />} />
          <Route path="/tasks" name="My Tasks" element={<TasksPage />} />
          <Route path="/inbox" name="Inbox" element={<InboxPage />} />
          <Route path="/about" name="About" element={<AboutPage />} />
          <Route path="/profile-page" name="Profile Page" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          {userData.role != 'Admin' && (
            <Route path="/dashboard" element={<Navigate to="homepage" replace />} />
          )}
        </Routes>
      </Suspense>
    </CContainer>
  )
}
