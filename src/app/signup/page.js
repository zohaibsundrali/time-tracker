'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Turnstile } from '@marsidev/react-turnstile'
import { useRouter } from 'next/navigation'

export default function SignupStart() {
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  // Handle Apple Signup
  const handleAppleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'apple' })
  }

  // Check if email already exists in Supabase
  const checkEmailExists = async (email) => {
    const { data, error } = await supabase
      .from('users') // your table name
      .select('id')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error(error)
      return false
    }

    return !!data // true if user exists
  }

  // Continue with Email (after Turnstile verification)
  const handleEmailContinue = async () => {
    setError('')
    if (!verified) {
      alert('Please verify you are human first.')
      return
    }

    if (!email) {
      setError('Please enter a valid email.')
      return
    }

    setLoading(true)

    try {
      // 1️⃣ Check if email is already registered
      const exists = await checkEmailExists(email)

      if (exists) {
        setError('This email is already registered. Please login.')
        setLoading(false)
        return
      }

      // 2️⃣ If not exists, store email and navigate to OTP page
      localStorage.setItem('signup_email', email)
      router.push('/signup/verify')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Create your account</h1>

        <button
          onClick={handleGoogleSignup}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={handleAppleSignup}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md mb-3"
        >
          Continue with Apple
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-700" />
          <span className="mx-3 text-gray-400">or</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-3 bg-gray-700 text-white rounded-md outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={() => setVerified(true)}
          className="mb-4"
        />

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <button
          onClick={handleEmailContinue}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Continue with Email'}
        </button>
      </div>
    </div>
  )
}
