"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Add state to track login process

  const onLogIn = async () => {
    setIsLoggingIn(true); // Set logging in state to true when login starts
    try {
      const response = await axios.post("/api/users/login", {
        ...user,
        rememberMe,
      });
      toast.success(response.data.message, {
        className: "bg-green-500 text-white font-bold p-4 rounded-lg shadow-lg",
      });

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong", {
        className: "bg-red-500 text-white font-bold p-4 rounded-lg shadow-lg",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-700 mb-6">
          {isLoggingIn ? "Logging In..." : "Log In"}
        </h1>
        <Toaster />
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

        <div className="mb-4 flex items-center">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />

          <label htmlFor="remember" className="ml-2 text-gray-600">
            Remember me for two weeks
          </label>
        </div>

        <button
          type="submit"
          onClick={onLogIn}
          className={`w-full py-2 text-white font-semibold rounded-lg transition-colors ${
            buttonDisabled
              ? "bg-blue-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={buttonDisabled}
        >
          Log In
        </button>

        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <Link href="/forgotpassword" className="hover:text-blue-500">
            Forgot password?
          </Link>
          <Link href="/signup" className="hover:text-blue-500">
            New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
