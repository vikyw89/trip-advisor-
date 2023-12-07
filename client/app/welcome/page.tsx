"use client"

import { useReadSessionQuery } from "@/store/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter()
  const session = useReadSessionQuery({})
  const signInHandler = () => {
    router.push("/auth")
  }

  useEffect(()=>{
    // if user already signed in, we redirect to app
    const userId = session.data?.user?.id
    if (userId) {
      router.push("/")
    }
  })
	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm relative w-full h-full flex flex-col justify-center items-center gap-5' style={{
        backgroundImage: "url('/images/onboarding.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        backgroundPosition: "center",
      }}>
        <div className='text-4xl font-bold bg-blend-difference text-white text-center'>
          DAEJEON GPT
        </div>
        <div className='text-xl font-bold bg-blend-difference text-white text-center'>
          Your travel partner
        </div>
        <button className='btn btn-primary rounded-full text-primary-content' onClick={signInHandler}>
          Sign-in
        </button>
			</div>
		</main>
	);
}
