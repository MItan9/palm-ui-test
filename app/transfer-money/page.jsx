// app/transfer-money.jsx

"use client";

import { useState } from "react";
import { useUserContext } from "@/app/user-context"; // Import user context for authentication

export default function TransferMoney() {
  const user = useUserContext();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Here you would handle the transfer logic, e.g., calling an API
    if (user.isAuthenticated) {
      // Simulate transfer success
      setMessage(`Successfully transferred $${amount} to ${recipient}`);
      setRecipient("");
      setAmount("");
    } else {
      setMessage("You must be logged in to make a transfer.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transfer Money</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Recipient Account"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border border-gray-300 rounded p-2"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
          Transfer
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
