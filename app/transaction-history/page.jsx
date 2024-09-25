// app/transaction-history.jsx

"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/app/user-context"; // Import user context for authentication

// Mock transaction data for demo purposes
const mockTransactions = [
  { id: 1, date: "2024-09-01", amount: 200, recipient: "John Doe", status: "Completed" },
  { id: 2, date: "2024-09-02", amount: -100, recipient: "Jane Smith", status: "Rejected" },
  { id: 3, date: "2024-09-05", amount: 150, recipient: "Company ABC", status: "In Progress" },
  { id: 4, date: "2024-09-10", amount: -50, recipient: "Shop XYZ", status: "Pending" },
];

export default function TransactionHistory() {
  const user = useUserContext();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user.isAuthenticated) {
      // Replace this with an API call to get the user's transaction history
      setTransactions(mockTransactions);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transaction History</h1>

      {!user.isAuthenticated ? (
        <p className="text-red-500">You must be logged in to view transaction history.</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Recipient</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`border-b ${
                    transaction.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  <td className="p-4">{transaction.date}</td>
                  <td className="p-4">
                    {transaction.amount < 0 ? `-$${Math.abs(transaction.amount)}` : `+$${transaction.amount}`}
                  </td>
                  <td className="p-4">{transaction.recipient}</td>
                  <td className="p-4">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
