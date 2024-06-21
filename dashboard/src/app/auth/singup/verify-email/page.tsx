"use client"

import React from "react"
import { toast, ToastContainer } from "react-toastify"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import "react-toastify/dist/ReactToastify.css"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const email = searchParams?.get("email")

  const onResendButtonClick = async () => {
    if (!email) {
      return toast.error("No email provided.")
    }

    setIsLoading(true)

    const signInResult = await signIn("email", {
      email: email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "pages/dashboard",
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      toast.error("Your resend email request failed. Please try again.")
    }

    if (signInResult?.error) {
      toast.error(signInResult.error)
    }

    toast.success("We sent you an account verification link. Be sure to check your spam too.")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Please verify your email</h1>
      <p className="text-center mb-4">
        We just sent an email to {email}. Click the link in the email to verify your account and sign-in.
      </p>
      <button
        onClick={onResendButtonClick}
        disabled={isLoading}
        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Sending...' : 'Resend Email'}
      </button>
      <ToastContainer />
    </div>
  )
}
