"use client";

import { useState } from "react";
import { useUserContext } from "@/app/user-context"; // Import user context for authentication
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

export default function TransferMoney() {
  const user = useUserContext();
  const router = useRouter(); // Using router from next/navigation for Next.js 13+ apps

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(""); // This will only hold the notification message
  const [optionalMessage, setOptionalMessage] = useState(""); // New state for the Optional Message input
  const [selectedPreviousRecipient, setSelectedPreviousRecipient] = useState("");

  // List of previous recipients
  const previousRecipients = ["John Doe", "Jane Smith", "Company ABC"];

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle the transfer logic, e.g., calling an API
    if (user.isAuthenticated && amount > 0) {
      // Simulate transfer success
  
      toast.success(`Successfully transferred $${amount} to ${recipient}`); // Show success notification

      // Reset form fields
      setRecipient("");
      setAmount("");
      setSelectedPreviousRecipient("");
      setOptionalMessage(""); // Reset optional message as well
    } else {
      toast.error("You must be logged in and the amount must be greater than zero to make a transfer."); // Show error notification
    }
  };

  // Auto-fill recipient when selecting from the dropdown
  const handlePreviousRecipientChange = (e) => {
    const selectedRecipient = e.target.value;
    setSelectedPreviousRecipient(selectedRecipient);
    setRecipient(selectedRecipient);
  };

  // Clear dropdown selection if user types manually
  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
    if (selectedPreviousRecipient) {
      setSelectedPreviousRecipient(""); // Clear dropdown when manual input happens
    }
  };

  const isFormValid = recipient && amount > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transfer Money</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-lg">
        {/* Previous Recipient Dropdown */}
        <div className="form-group flex flex-col">
          <label htmlFor="previousRecipients" className="mb-2 font-medium">Select Previous Recipient</label>
          <select
            id="previousRecipients"
            value={selectedPreviousRecipient}
            onChange={handlePreviousRecipientChange}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">-- Select a Previous Recipient --</option>
            {previousRecipients.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Name/Account Number */}
        <div className="form-group flex flex-col">
          <label htmlFor="recipient" className="mb-2 font-medium">Recipient’s Name/Account Number</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={handleRecipientChange} // Clear dropdown when user types manually
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Amount */}
        <div className="form-group flex flex-col">
          <label htmlFor="amount" className="mb-2 font-medium">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Optional Message */}
        <div className="form-group flex flex-col">
          <label htmlFor="optionalMessage" className="mb-2 font-medium">Optional Message</label>
          <input
            type="text"
            id="optionalMessage"
            value={optionalMessage} // Controlled by optionalMessage state
            onChange={(e) => setOptionalMessage(e.target.value)} // Updates optionalMessage state, not the message for transfer
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`p-2 rounded ${isFormValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-200"}`}
          disabled={!isFormValid}
        >
          Send
        </button>
      </form>

      {message && <p className="mt-4 text-green-500">{message}</p>}

      {/* Back to Dashboard button at the end of the page */}
      <div className="mt-8">
        <button
          onClick={() => router.push("/dashboard")} // Correct router navigation
          className="px-4 py-2"
          style={{ backgroundColor: "#17a2b8", color: "white", borderRadius: "0.375rem" }} // Applying the new color and styles
        >
          Back to Dashboard
        </button>
      </div>

      {/* Snackbar/Toast container */}
      <ToastContainer />
    </div>
  );
}
