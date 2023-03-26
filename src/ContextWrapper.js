import HeaderContext from './HeaderContext'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

function ContextWrapper({ children }) {
  ContextWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  }
  const [userData, setUserData] = useState(null)
  const [allInternalUsers, setAllInternalUsers] = useState(null)
  return (
    <HeaderContext.Provider
      value={{
        userData,
        setUserData,
        allInternalUsers,
        setAllInternalUsers,
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export default ContextWrapper
