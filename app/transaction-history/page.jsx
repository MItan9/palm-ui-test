"use client"; 

import { useState, useEffect } from "react";
import { useUserContext } from "@/app/user-context"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 

export default function TransactionHistory() {
  const user = useUserContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [accountNum, setAccountNum] = useState(""); 
  const router = useRouter(); 
  const [name, setName] = useState(""); 

  async function fetchUserData() {
    const axiosInstance = axios.create({ baseURL: '/bff/api' });
    try {
      const userResponse = await axiosInstance.get("/me");
      const username = userResponse.data.username;
      
      setName(username)
      fetchAccountNumber(username); 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchAccountNumber(username) {

    const axiosInstance = axios.create({ baseURL: '/bff/api' });
    try {
      const accountResponse = await axiosInstance.get(`/api/accounts/${username}`);
      console.log('data',accountResponse.data)
      console.log('ACCOUNTNUMBER',accountResponse.data.accountNum);
      setAccountNum(accountResponse.data.accountNum); 
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  }

  async function fetchTransactionData() {

    const axiosInstance = axios.create({ baseURL: '/bff/api' });
    try {
      const accountResponse = await axiosInstance.get(`/api/transactions/getTransactions`,
        { params: { accountNum } }
      );
      setTransactions(accountResponse.data); 
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setTransactions([]); 
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchAccountNumber(name)
  }, []);

  useEffect(() => {
    if (accountNum && user.isAuthenticated) {
      fetchTransactionData();
    }
  }, [accountNum, user]);

 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Transaction History</h1>
      {loading ? (
        <p>Loading transaction history...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sender</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recipient</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.amount} {transaction.currency}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.sourceAccount.username} ({transaction.sourceAccount.accountNum})
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.targetAccount.username} ({transaction.targetAccount.accountNum})
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.message}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {transaction.status.replace("_", " ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={() => router.push('/')}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}