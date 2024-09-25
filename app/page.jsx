"use client";

import { useUserContext } from "@/app/user-context";
import Link from "next/link";

export default function Home() {
  const user = useUserContext();
  const message = user.isAuthenticated
    ? `Hi ${user.name}, you are granted with ${rolesStr(user)}.`
    : "You are not authenticated.";

  function rolesStr(user) {
    if (!user?.roles?.length) {
      return "[]";
    }
    return `["${user.roles.join('", "')}"]`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
        {!user.isAuthenticated && (
          <>
            <p className="text-lg text-gray-700 mb-4">{message}</p>
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
              <Link href="/login">Login</Link>
            </button>
          </>
        )}
      </div>
    </main>
  );
}
