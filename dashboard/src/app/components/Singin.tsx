"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Icons } from "./icons"
import { useEffect } from "react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  signInType: string
}

const userAuthSchema = z.object({
  email: z.string().email(),
})

type FormData = z.infer<typeof userAuthSchema>

export function SignIn({
  signInType,
  className,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isOAuthLoading, setIsOAuthLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<String>()
  const searchParams = useSearchParams()
  const invitationCode = searchParams?.get("invitationCode")

  useEffect(() => {
    const callbackError = searchParams?.get("error")

    if (callbackError === "OAuthAccountNotLinked") {
      signInType == "login"
        ? setError("Use different provider for Sign in.")
        : setError("There is already an account with that email.")

      toast.error("error");
    }
  }, [searchParams, signInType])

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    
    console.log(`Searchparams get form - ${searchParams?.get("from")}`)
    const email = data.email.toLowerCase()

    const signInResult = await signIn("email", {
      email: email,
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/pages/dashboard",
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      toast.error("something went wrong")
    }

    if (signInResult?.error) {
      toast.error("error")
    }

    toast.success("Check your email");

    signInType == "login"
      ? router.push(`auth/signin/verify-email?email=${email}`)
      : router.push(`auth/singup/verify-email?email=${email}`)
  }

  return (
    <div className="flex flex-col items-center justify-center" {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center mb-6">
          
        </div>
        <div className="">
          
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 border border-black rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => {
              setIsOAuthLoading(true)
              signIn("google", {
                redirect: false,
                callbackUrl: searchParams?.get("from") || "/pages/dashboard",
                invitationCode: invitationCode,
              })
            }}
            disabled={isLoading || isOAuthLoading}
          >
            {isOAuthLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Continue with Google
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-black bg-white">or</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full px-3 py-2 border text-black border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="name@example.com"
                disabled={isLoading || isOAuthLoading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {signInType === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {signInType === "login" ? (
            <>
              Don't have an account?{" "}
              <a href="/auth/singup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
