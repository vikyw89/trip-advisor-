'use client';
import { z } from 'zod';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTripMutation } from '@/store/tripApi';
export const Place = z.object({
	id: z.string(),
	name: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	picture: z.string(),
});

export const TripCardPropsSchema = z.object({
	id: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	destination: z.string(),
	pictureUrl: z.string(),
	isNewTrip: z.optional(z.boolean()),
});

export type TripCardProps = z.infer<typeof TripCardPropsSchema>;

export const TripCard = ({ props }: { props: TripCardProps }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 0.7 });
	const router = useRouter();
	const [createTrip, createTripResponse] = useCreateTripMutation();

	const tripCardClickHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
		// check if it's a new card or existing one
		// create a new trip
		let tripId = props.id;
		if (props.isNewTrip) {
			const res = await createTrip({}).unwrap();
			tripId = res.tripId;
		}
		router.push(`/trips/${tripId}`);
	};
	return (
		<div
			className='cursor-pointer w-[300px] min-w-[300px] max-w-lg shadow-md h-[200px] relative rounded-box overflow-hidden ml-2'
			ref={ref}
			onClick={tripCardClickHandler}
		>
			{!props.isNewTrip && (
				<>
					<Image
						src={props.pictureUrl}
						alt={props.pictureUrl}
						fill
						sizes='100%'
						className={`hover:scale-150 ${
							isInView ? 'grayscale-0 scale-150' : 'grayscale'
						} duration-300 grayscale hover:grayscale-0 hover:shadow-inner`}
						style={{
							objectFit: 'cover',
							opacity: 0.8,
						}}
					/>
					<div
						className={`${
							isInView ? 'flex' : 'hidden'
						} animate-fade-up animate-once animate-ease-in-out duration-300 flex-col p-4 drop-shadow-md bottom-0 from-transparent to-black absolute w-full bg-gradient-to-b rounded-b-box`}
					>
						<div className='text-2xl font-extrabold mix-blend-difference text-white/70'>
							{props.destination}
						</div>
						<div className='text-base  mix-blend-difference text-white/70'>
							{props.startDate} - {props.endDate}
						</div>
					</div>
				</>
			)}
			{props.isNewTrip && (
				<>
					<Image
						src={props.pictureUrl}
						alt={props.pictureUrl}
						fill
						sizes='100%'
						className={`hover:scale-150 ${
							isInView ? 'grayscale-0 scale-150' : 'grayscale'
						} duration-300 grayscale hover:grayscale-0 hover:shadow-inner`}
						style={{
							objectFit: 'cover',
							opacity: 0.8,
						}}
					/>
					<div
						className={`${
							isInView ? 'flex' : 'hidden'
						} animate-fade-up animate-once animate-ease-in-out duration-300 flex-col p-4 drop-shadow-md bottom-0 from-transparent to-black absolute w-full bg-gradient-to-b rounded-b-box`}
					>
					</div>
				</>
			)}
		</div>
	);
};
