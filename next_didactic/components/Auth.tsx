'use client';

import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const { user, signUp, signIn, signOut, resetPassword } = useAuth()
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await signUp(email, password)
        alert('Check your email for the confirmation link')
      } else if (isForgotPassword) {
        await resetPassword(email)
        alert('Check your email for the password reset link')
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      alert(error.message)
    }
  }

  if (user) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-800 dark:text-gray-200 mb-4">Welcome, <span className="font-semibold">{user.email}</span>!</p>
        <button 
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
        <button 
          onClick={() => router.push('/')}
          className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
        {isSignUp ? 'Create an Account' : (isForgotPassword ? 'Reset Password' : 'Sign In')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        {!isForgotPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        )}
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isSignUp ? 'Sign Up' : (isForgotPassword ? 'Send Reset Link' : 'Sign In')}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {!isForgotPassword && (
          <button 
            onClick={() => setIsForgotPassword(true)}
            className="text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            Forgot Password?
          </button>
        )}
        {isForgotPassword && (
          <button 
            onClick={() => setIsForgotPassword(false)}
            className="text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            Back to Sign In
          </button>
        )}
      </div>
      {!isForgotPassword && (
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      )}
      <button 
        onClick={() => router.push('/')}
        className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  )
}