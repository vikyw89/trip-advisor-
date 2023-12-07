"use client"
import { Loading } from "@/components/Loading";
import { useReadSessionQuery } from "@/store/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

export default function Authentication({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter()
    const { data, isError, isLoading } = useReadSessionQuery({})

    // if auth error, redirect to login
    useEffect(()=>{
        if (isLoading) return
        
        if (!data?.user?.id || isError){
            router.push('/welcome')
        }
    })
    return (
        <>
            {isLoading && <Loading />}
            {data && <>{children}</>}
            <Toaster/>
        </>);

}