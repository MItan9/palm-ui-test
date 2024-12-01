"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/app/user-context"; 
import { useRouter } from "next/navigation"; 
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"; 

export default function TransferMoney() {
  const user = useUserContext();
  const router = useRouter();

  const [senderUsername, setSenderUsername] = useState(""); 
  const [receiverUsername, setReceiverUsername] = useState(""); 
  const [receiverId, setReceiverId] = useState(""); 
  const [senderId, setSenderId] = useState(""); 
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (senderUsername) {
      fetchAccountId(senderUsername, true); 
    }
    if (receiverUsername) {
      fetchAccountId(receiverUsername, false);
    }
  }, [senderUsername, receiverUsername]);

  async function fetchAccountId(username, isSender) {
    const axiosInstance = axios.create({ baseURL: '/bff/api' });
    try {
      const accountResponse = await axiosInstance.get(`/api/accounts/${username}`);
      const accountId = accountResponse.data.id;
      console.log(`${isSender ? 'Sender' : 'Receiver'} ID:`, accountId);
      if (isSender) {
        setSenderId(accountId);
      } else {
        setReceiverId(accountId);
      }
    } catch (error) {
      console.error(`Error fetching ${isSender ? 'sender' : 'receiver'} account number:`, error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user.isAuthenticated && parseFloat(amount) > 0) {
      const postData = {
        senderAccountId: senderId, 
        receiverAccountId: receiverId,
        amount: parseFloat(amount),
        createdBy: senderUsername,
        description: comment
      };

      try {
        const axiosInstance = axios.create({ baseURL: '/bff/api' });
        const response = await axiosInstance.post('/api/transactions/create', postData);
        console.log('Success:', response.data);
        toast.success(`Successfully transferred $${amount} to ${receiverUsername}`);
        resetForm();
      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to make a transfer.");
      }
    } else {
      toast.error("You must be logged in and the amount must be greater than zero to make a transfer.");
    }
  };

  const handleSenderChange = (e) => {
    setSenderUsername(e.target.value);
    fetchAccountId(e.target.value, true); 
  };

  const handleRecipientChange = (e) => {
    setReceiverUsername(e.target.value);
    fetchAccountId(e.target.value, false); 
  };

  const resetForm = () => {
    setSenderUsername("");
    setReceiverUsername("");
    setAmount("");
    setComment("");
  };

  const isFormValid = senderId && receiverId && parseFloat(amount) > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transfer Money</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-lg">
        <div className="form-group flex flex-col">
          <label htmlFor="senderUsername" className="mb-2 font-medium">Your Username</label>
          <input
            type="text"
            id="senderUsername"
            value={senderUsername}
            onChange={handleSenderChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="form-group flex flex-col">
          <label htmlFor="receiverUsername" className="mb-2 font-medium">Recipient's Username</label>
          <input
            type="text"
            id="receiverUsername"
            value={receiverUsername}
            onChange={handleRecipientChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

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

        <div className="form-group flex flex-col">
          <label htmlFor="comment" className="mb-2 font-medium">Comment (Optional)</label>
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className={`p-2 rounded ${isFormValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-200"}`}
          disabled={!isFormValid}
        >
          Send
        </button>
      </form>

      <div className="mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
