"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  appName?: string;
}

export function Header({ appName = "BlogApp" }: HeaderProps) {
  // Simular estado de autenticación (por ahora siempre false)
  const [isLoggedIn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Left Side */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {appName}
            </Link>
          </div>

          {/* Navigation/Authentication - Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />

            {!isLoggedIn ? (
              // Not logged in - Show login/signup buttons
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              // Logged in - Show avatar with logout on hover
              <div
                className="relative"
                onMouseEnter={() => setShowLogout(true)}
                onMouseLeave={() => setShowLogout(false)}
              >
                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      U
                    </span>
                  </div>
                </button>

                {/* Logout dropdown */}
                {showLogout && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        // TODO: Implement logout functionality
                        console.log('Logout clicked');
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
