import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
  }, [aToken])

  const handlePasswordUpdate = async () => {
    try {
        const { data } = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/update-doctor-password', 
            {
                doctorId: selectedDoctor._id,
                newPassword
            },
            {
                headers: {
                    atoken: aToken // Using the existing 'atoken' header
                }
            }
        );
        if (data.success) {
            toast.success('Password updated successfully')
            setShowPasswordModal(false)
            setNewPassword('')
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error('Error updating password')
    }
}

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 mt-2 text-sm"
                onClick={() => {
                    setSelectedDoctor(item)
                    setShowPasswordModal(true)
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Password change modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Change Password for {selectedDoctor?.name}</h3>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 border rounded mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowPasswordModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-primary text-white px-4 py-2 rounded"
                        onClick={handlePasswordUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList