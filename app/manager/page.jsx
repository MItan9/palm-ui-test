"use client";

import { useUserContext } from "@/app/user-context";
import { useEffect, useState } from "react";

export default function Manager() {
  const user = useUserContext();
  const [isManager, setIsManager] = useState(false);

  // Initial list of pending transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2024-09-02", amount: 100, recipient: "John Doe", status: "Pending" },
    { id: 2, date: "2024-09-03", amount: 200, recipient: "Jane Smith", status: "Pending" },
  ]);

  // Handle confirming a transaction
  const confirmTransaction = (id) => {
    setTransactions(transactions.map(transaction =>
      transaction.id === id ? { ...transaction, status: "Confirmed" } : transaction
    ));
  };

  // Handle rejecting a transaction
  const rejectTransaction = (id) => {
    setTransactions(transactions.map(transaction =>
      transaction.id === id ? { ...transaction, status: "Rejected" } : transaction
    ));
  };

  useEffect(() => {
    if (user.isAuthenticated) {
      // Assuming user.roles contains roles and "manager" is one of them
      setIsManager(user.roles?.includes("manager"));
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Manager Dashboard</h1>

      {!user.isAuthenticated ? (
        <p className="text-red-500">You must be logged in to view manager details.</p>
      ) : !isManager ? (
        <p className="text-red-500">You do not have access to the Manager Dashboard.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}</h2>
          <p className="mb-4">As a manager, you can:</p>
          <ul className="list-disc list-inside mb-8">
            <li>View and manage user accounts</li>
            <li>Review transactions</li>
            <li>Oversee system activities</li>
            <li>Generate reports</li>
          </ul>

          {/* Transactions Table */}
          <h2 className="text-2xl font-semibold mb-4">Manage Transactions</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Recipient</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="px-4 py-2">{transaction.date}</td>
                  <td className="px-4 py-2">${transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.recipient}</td>
                  <td className="px-4 py-2">{transaction.status}</td>
                  <td className="px-4 py-2">
                    {transaction.status === "Pending" && (
                      <>
                        <button
                          className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                          onClick={() => confirmTransaction(transaction.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded"
                          onClick={() => rejectTransaction(transaction.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
