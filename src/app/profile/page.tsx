"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [data, setData] = useState("");
  const router = useRouter();

  const logOut = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log(response.data);
      toast.success("Logged out successfully", {
        className: "bg-green-500 text-white font-bold p-4 rounded-lg shadow-lg",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Profile Page
        </h1>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-gray-700">User ID:</h2>
            <p className="text-lg font-medium text-gray-600 mt-2">
              {data === "" ? "Empty" : data}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {data !== "" && (
                <Link
                  href={`profile/${data}`}
                  className="text-blue-600 hover:underline"
                >
                  View User Profile
                </Link>
              )}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={logOut}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Log Out
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
}
