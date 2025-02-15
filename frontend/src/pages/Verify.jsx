import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")
    const { backendUrl, token } = useContext(AppContext)
    
    const navigate = useNavigate()
    const [isVerified, setIsVerified] = useState(false)

    // Function to verify stripe payment
    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/verifyStripe", 
                { success, appointmentId }, 
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsVerified(true)
                // Show success message for 2 seconds before redirecting
                setTimeout(() => {
                    navigate("/my-appointments")
                }, 2000)
            } else {
                toast.error(data.message)
                // Redirect to appointments page even if verification fails
                setTimeout(() => {
                    navigate("/my-appointments")
                }, 2000)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
            // Redirect to appointments page on error
            setTimeout(() => {
                navigate("/my-appointments")
            }, 2000)
        }
    }

    useEffect(() => {
        if (token && appointmentId && success) {
            verifyStripe()
        } else {
            // Redirect if required params are missing
            navigate("/my-appointments")
        }
    }, [token])

    return (
        <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4'>
            <div className={`w-20 h-20 border-4 border-gray-300 rounded-full animate-spin ${
                isVerified ? 'border-t-green-500' : 'border-t-primary'
            }`}></div>
            <p className="text-gray-600">
                {isVerified ? 'Payment verified! Redirecting...' : 'Verifying payment...'}
            </p>
        </div>
    )
}

export default Verify