// app/dashboard.jsx

"use client";

import Link from "next/link";
import { useUserContext } from "@/app/user-context";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const user = useUserContext();
  const [balance, setBalance] = useState("N/A");

  useEffect(() => {
    if (user.isAuthenticated) {
      // Replace with an API call to fetch balance
      setBalance("$10,000"); // Mock balance for demo purposes
    }
  }, [user]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-2xl font-semibold mb-6">Menu</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/transaction-history" className="hover:text-gray-300">Transaction History</Link>
            </li>
            <li>
              <Link href="/transfer-money" className="hover:text-gray-300">Transfer Money</Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {!user.isAuthenticated ? (
          <p className="text-red-500">You must be logged in to view your dashboard.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Balance</h2>
            <p className="text-2xl font-semibold text-green-500">{balance}</p>
          </div>
        )}
      </div>
    </div>
  );
}
