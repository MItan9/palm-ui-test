"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import Link from "next/link"; // Import Link for navigation
import "./globals.css";
import Authentication from "./lib/auth/authentication.component";
import { User, UserService } from "./lib/auth/user.service";
import { UserContext } from "./user-context";
import "./transfer-money/page.jsx";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [user, setUser] = useState(User.ANONYMOUS);
  const userService = new UserService(user, setUser);

  // Example balance; replace with actual logic to fetch the user's balance
  const userBalance = user.isAuthenticated ? 1500.00 : 0.00;

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext.Provider value={user}>
          <div className="flex min-h-screen">
            <div className="flex-1 p-6 bg-transparent"> {/* Set background to transparent */}
              <div className="mt-4">
                <Authentication
                  onLogin={() => userService.refresh(user, setUser)}
                />
              </div>
              <div className="mt-4">{children}</div>
            </div>
          </div>
        </UserContext.Provider>
      </body>
    </html>
  );
}
