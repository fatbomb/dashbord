import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import ShapedLogo from "./components/shaped-logo"
import { SignIn } from "./components/Singin"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ShapedLogo />
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Welcome back
          </h1>
        </div>
        <SignIn
        signInType="login"
        className=""/>
      </div>
    </div>
    </main>
  )
}