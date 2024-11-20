"use client"
import axios from "axios";
import { set } from "mongoose";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage(){
    const [email, setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e:any) => {
        setLoading(true);
        e.preventDefault();
        try{
            const response = await axios.post("/api/users/forgotpassword",{email});
            setMessage(response.data.message);
            toast.success(response.data.message)
        }catch(error:any){
            setMessage(error.response.data.error);
            toast.error(error.response.data.error)
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-xl font-semibold text-gray-700 mb-6">
                    {loading ? "Sending OTP..." : "Forgot Password"}
                </h1>
                <Toaster />
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email Address</label>
                        <div className="relative mt-2">
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}