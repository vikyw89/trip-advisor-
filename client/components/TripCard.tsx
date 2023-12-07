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
    const router = useRouter()
	const [createTrip, createTripResponse] = useCreateTripMutation()

    const tripCardClickHandler = async (e:React.MouseEvent<HTMLDivElement>) => {
        // check if it's a new card or existing one
		// create a new trip
		let tripId = props.id
		if (props.isNewTrip){
			const res = await createTrip({}).unwrap()
			tripId = res.tripId
		}
        router.push(`/trips/${tripId}`);
    }
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
					<svg
						className='w-full h-full'
						xmlns='http://www.w3.org/2000/svg'
						width='1em'
						height='1em'
						viewBox='0 0 512 512'
					>
						<path
							fill='currentColor'
							d='M424.188 85.594c.33.05-.86.094-3.313.094c-18.512 0-35.78 20.06-35.78 47.5c0 13.83 4.712 26.208 11.624 34.78l10.217 12.626l-16.062 2.47c-10.56 1.617-17.663 6.432-23.625 14.342s-10.344 19.18-13.25 32.344c-5.186 23.492-5.59 52.425-5.625 78.156h30.438l.593 8.72l7.094 106.593h65.813l8.03-106.69l.657-8.624h32c-.24-25.383-1.62-53.933-7.344-77.25c-3.213-13.086-7.783-24.354-13.687-32.375c-5.905-8.02-12.7-12.85-22.064-14.593l-15.72-2.937l10.283-12.25c7.228-8.623 12.186-21.138 12.186-35.313c0-25.74-15.5-45.406-32.28-47.562l-.188-.03zm-244.75 3.375c-45.9.006-99.844 5.373-161.625 17.905V126c268.018-37.648 341.545 38.15 226.25 79.344c-117.327 41.92-210.503 252.258 159.406 270.594c4.362.438 8.85.687 13.436.687c22.28 0 42.34-5.452 56.125-13.594c13.787-8.14 20.595-18.14 20.595-27.905s-6.808-19.764-20.594-27.906c-.23-.138-.482-.272-.717-.408l-2 26.47l-.657 8.656H369l-.563-8.75l-3.28-49.5c-128.194 2.8-163.256-100.51-80.094-130.47c20.385-7.344 37.086-15.836 50.187-25.03c.17-.822.32-1.655.5-2.47c3.262-14.774 8.256-28.498 16.594-39.562c4.946-6.563 11.24-12.07 18.72-15.97c-3.124-42.547-68.335-81.236-191.627-81.217z'
						></path>
					</svg>
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
		</div>
	);
};
