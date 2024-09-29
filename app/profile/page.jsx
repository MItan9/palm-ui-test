"use client";

import { useUserContext } from "@/app/user-context";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for Next.js 13+ apps
import { useState } from "react";

export default function Profile() {
  const user = useUserContext();
  const router = useRouter(); // Using router from next/navigation for navigation

  // State for personal information form
  const [profileData, setProfileData] = useState({
    name: user.name || "John Doe",
    email: user.email || "john.doe@example.com",
    phone: "N/A",
  });

  // State for password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Add logic for updating profile (API call)
    console.log("Profile updated:", profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Add logic for changing password (API call)
    if (passwordData.newPassword === passwordData.confirmNewPassword) {
      console.log("Password updated successfully:", passwordData);
    } else {
      console.error("Passwords do not match!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>

      {!user.isAuthenticated ? (
        <p className="text-red-500">You must be logged in to view profile details.</p>
      ) : (
        <>
          {/* Personal Information Form */}
          <form className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl mb-6" onSubmit={handleProfileSubmit}>
            <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg p-3" // Increased padding for better spacing
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">Save Changes</button>
          </form>

          {/* Password Change Form */}
          <form className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl" onSubmit={handlePasswordSubmit}>
            <h3 className="text-2xl font-semibold mb-4">Change Password</h3>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmNewPassword" className="block mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">Change Password</button>
          </form>

          {/* Back to Dashboard button at the end of the page */}
          <div className="mt-8">
            <button
                onClick={() => router.push('/')} // Correct router navigation
                className="px-4 py-2"
                style={{ backgroundColor: "#17a2b8", color: "white", borderRadius: "0.375rem" }} // Applying the new color and styles
            >
                Back to Dashboard
            </button>
            </div>
        </>
      )}
    </div>
  );
}
