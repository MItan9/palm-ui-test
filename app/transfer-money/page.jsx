// app/transfer-money.jsx

"use client";

import { useState } from "react";
import { useUserContext } from "@/app/user-context"; // Import user context for authentication

export default function TransferMoney() {
  const user = useUserContext();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPreviousRecipient, setSelectedPreviousRecipient] = useState("");

  // List of previous recipients
  const previousRecipients = ["John Doe", "Jane Smith", "Company ABC"];

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle the transfer logic, e.g., calling an API
    if (user.isAuthenticated && amount > 0) {
      // Simulate transfer success
      setMessage(`Successfully transferred $${amount} to ${recipient}`);
      setRecipient("");
      setAmount("");
      setSelectedPreviousRecipient("");
    } else {
      setMessage("You must be logged in and the amount must be greater than zero to make a transfer.");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transfer Money</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/* Previous Recipient Dropdown */}
        <div className="form-group flex flex-col">
          <label htmlFor="previousRecipients" className="mb-2 font-medium">Select Previous Recipient</label>
          <select
            id="previousRecipients"
            value={selectedPreviousRecipient}
            onChange={handlePreviousRecipientChange}
            className="border border-gray-300 rounded p-2"
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
            className="border border-gray-300 rounded p-2"
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
            className="border border-gray-300 rounded p-2"
          />
        </div>

        {/* Optional Message */}
        <div className="form-group flex flex-col">
          <label htmlFor="message" className="mb-2 font-medium">Optional Message</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          disabled={!(recipient && amount > 0)}
        >
          Send
        </button>
      </form>

      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
