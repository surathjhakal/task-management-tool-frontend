import { CSpinner } from '@coreui/react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import customerService from '../../services/customerService'
import filesService from '../../services/filesService'
import internalUserService from '../../services/internalUserService'
import HeaderContext from '../../HeaderContext'
import './ProfilePage.css'

const ProfilePage = () => {
  const { userData, setUserData } = useContext(HeaderContext)
  const [userChanges, setUserChanges] = useState(userData)
  const [changeProfilePhoto, setChangeProfilePhoto] = useState('')
  const [profileUpdating, setProfileUpdating] = useState(false)

  const handleChanges = (type, value) => {
    setUserChanges({ ...userChanges, [type]: value })
  }

  const formatFileName = (fileName) => {
    if (!fileName) return null
    return fileName.toLowerCase().trim().split(' ').join('-')
  }

  const handleSaveUserChanges = async () => {
    console.log(userChanges)
    if (userChanges.name == '') return toast.error("you can't give empty name")
    if (userChanges.mobileNumber == '') return toast.error("you can't give empty mobile number")
    setProfileUpdating(true)
    let updatedUserData = userChanges
    if (changeProfilePhoto && changeProfilePhoto != '') {
      if (userChanges.profilePhoto) {
        filesService.deleteFiles({ files: [userChanges.profilePhoto] }).then((res) => {
          console.log('files deleted successfully', res)
        })
      }
      updatedUserData.profilePhoto = formatFileName(changeProfilePhoto.name)
      const formData = new FormData()
      formData.append('file', changeProfilePhoto)
      const res = await filesService.uploadProfilePhoto(formData)
      console.log(res)
    }
    if (userData?.role) {
      internalUserService.updateAdminUser(userData.uuid, updatedUserData).then((res) => {
        console.log(res)
        if (res.data) {
          setUserData(updatedUserData)
          setUserChanges(updatedUserData)
          setChangeProfilePhoto('')
          toast.success('Updated profile data')
          setProfileUpdating(false)
        }
      })
    } else {
      customerService.updateCustomer(userData.uuid, updatedUserData).then((res) => {
        console.log(res)
        if (res.data) {
          setUserData(updatedUserData)
          setUserChanges(updatedUserData)
          setChangeProfilePhoto('')
          toast.success('Updated profile data')
          setProfileUpdating(false)
        }
      })
    }
  }

  const handleChangeProfilePhoto = (e) => {
    const file = e.target.files[0]
    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg') {
      setChangeProfilePhoto(file)
    } else {
      toast.error('Only jpeg,png,jpg is allowed')
      setChangeProfilePhoto('')
    }
  }

  console.log(process.env.REACT_APP_DEFAULT_PROFILE_PIC)

  return (
    <div className="profilePage">
      <div className="profilePage_header" style={{ position: 'relative' }}>
        <img
          src={
            userChanges.profilePhoto
              ? process.env.REACT_APP_IMAGE_PATH + userChanges.profilePhoto
              : process.env.REACT_APP_DEFAULT_PROFILE_PIC
          }
          alt="image"
          className="profilePage_image"
        />
        <input
          type="file"
          onChange={handleChangeProfilePhoto}
          style={{ position: 'absolute', left: '1rem' }}
          // value={changeProfilePhoto}
          placeholder="kudsbhfu"
        />
        <div className="profilePage_header_info">
          <h2>{userChanges.name}</h2>
          <p>{userChanges.location}</p>
        </div>
      </div>
      <div className="profilePage_info">
        <div className="profilePage_info_line">
          <div className="profilePage_content">
            <p>Name</p>
            <input
              type="text"
              name="user_firstName"
              placeholder="Enter your Name"
              value={userChanges.name}
              onChange={(e) => handleChanges('name', e.target.value)}
            />
          </div>
          <div className="profilePage_content">
            <p>Email Address</p>
            <input
              type="text"
              placeholder="Enter your email"
              disabled
              value={userChanges.email}
              onChange={(e) => handleChanges('email', e.target.value)}
            />
          </div>
        </div>
        <div className="profilePage_info_line">
          <div className="profilePage_content">
            <p>Phone Number</p>
            <input
              type="number"
              placeholder="Enter your phone no."
              value={userChanges.mobileNumber}
              onChange={(e) => handleChanges('mobileNumber', e.target.value)}
            />
          </div>
          <div className="profilePage_content">
            <p>Gender</p>
            <input
              type="text"
              placeholder="e.g. Male or Female"
              name="user_gender"
              value={userChanges.gender}
              onChange={(e) => handleChanges('gender', e.target.value)}
            />
          </div>
        </div>
        <div className="profilePage_info_line">
          <div className="profilePage_content">
            <p>Location</p>
            <input
              type="text"
              placeholder="e.g. Mumbai,India"
              name="user_location"
              value={userChanges.location}
              onChange={(e) => handleChanges('location', e.target.value)}
            />
          </div>
          <div className="profilePage_content">
            <p>Profession</p>
            <input
              type="text"
              placeholder="e.g. Teacher"
              name="profession"
              value={userChanges.profession}
              onChange={(e) => handleChanges('profession', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="profilePage_save_changes">
        <button
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          disabled={userChanges == {}}
          onClick={handleSaveUserChanges}
        >
          Save Changes
          {profileUpdating && <CSpinner color="secondary" />}
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
