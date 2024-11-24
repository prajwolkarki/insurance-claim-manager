"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ClaimForm = () => {
  const [formData, setFormData] = useState({
    claimType: "",
    amount: "",
    documents: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formData.documents.forEach((file) => {
      formDataToSend.append("documents", file);
    });

    formDataToSend.append("claimType", formData.claimType);
    formDataToSend.append("amount", formData.amount);

    try {
      const response = await axios.post("/api/claim", formDataToSend);
      toast.success(response.data.message || "Claim submitted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit claim!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Submit a Claim
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="claimType"
            className="block text-gray-700 font-medium"
          >
            Claim Type
          </label>
          <select
            id="claimType"
            name="claimType"
            value={formData.claimType}
            onChange={(e) =>
              setFormData({ ...formData, claimType: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select a type</option>
            <option value="OPD">OPD</option>
            <option value="Hospitalized">Hospitalized</option>
            <option value="Dental">Dental</option>
            <option value="Eye Checkup">Eye Checkup</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-gray-700 font-medium">
            Claim Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Enter the amount"
            required
          />
        </div>

        <div>
          <label
            htmlFor="documents"
            className="block text-gray-700 font-medium"
          >
            Upload Documents
          </label>
          <input
            type="file"
            id="documents"
            name="documents"
            multiple
            onChange={(e) => {
              setFormData({
                ...formData,
                documents: Array.from(e.target.files || []),
              });
            }}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 font-bold rounded-md transition duration-300 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
};

export default ClaimForm;
