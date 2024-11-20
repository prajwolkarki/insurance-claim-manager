// Code: Sign Up Page
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export default function SignUp() {

  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const onSignUp = async () => {
    setIsSigningUp(true);
    try {
      const response = await axios.post("/api/users/signup", user);
     // console.log(response.data);
      toast.success(response.data.message, {
        className: "bg-green-500 text-white font-bold p-4 rounded-lg shadow-lg",
      });
 
      setTimeout(() => {
        router.push("/login");
      }, 3000); 
    } catch (error:any) {
      toast.error(error.response?.data?.error || "Something went wrong", {
        className: "bg-red-500 text-white font-bold p-4 rounded-lg shadow-lg",
      });
    }finally{
      setIsSigningUp(false);
    }
  };
  
  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-700 mb-6">
          {isSigningUp ? "Signing Up..." : "Sign Up"}
        </h1>
        <Toaster />
        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium">
            Username
          </label>
          <div className="relative mt-2">
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              👤
            </span>
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email Address
          </label>
          <div className="relative mt-2">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              📧
            </span>
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              ✳️
            </span>
          </div>
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          onClick={onSignUp}
          className={`w-full py-2 text-white font-semibold rounded-lg transition-colors ${
            buttonDisabled
              ? "bg-blue-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={buttonDisabled}
        >
          Sign Up
        </button>

        {/* Links */}
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
