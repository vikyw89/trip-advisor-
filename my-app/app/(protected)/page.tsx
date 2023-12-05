"use client"
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter()
	const planTripHandler = () => {
		router.push("/trips")
	}
	return (
		<main className='w-full h-full flex justify-center'>
			<div
				className='max-w-screen-sm relative w-full h-full flex flex-col justify-start items-center gap-5'
				style={{
					backgroundImage: "url('/images/onboarding.jpg')",
					backgroundRepeat: 'no-repeat',
					backgroundSize: '100%',
					backgroundPosition: 'center',
				}}
			>
				<button className="btn btn-primary rounded-full mt-[60%]" onClick={planTripHandler}>
					Plan a new Trip
				</button>
				<button className="btn btn-disabled rounded-full">
					My Trips
				</button>
			</div>
		</main>
	);
}
