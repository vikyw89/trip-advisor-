'use client';
import { ExploreCard } from '@/components/ExploreCard';
import { TripCard } from '@/components/TripCard';
import { useReadSessionQuery } from '@/store/authApi';
import { useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Image from 'next/image';
import { useReadTripsQuery } from '@/store/tripApi';

const InitialState = {
	explore: [
		{
			id: 'seoul',
			name: 'Seoul',
			latitude: 37.5666791,
			longitude: 126.9782914,
			imageUrl:
				'https://media.istockphoto.com/id/464629385/photo/seoul-skyline.jpg?s=612x612&w=0&k=20&c=Wo9LYxk6L9z0VORPkMxjubMcAZfWAJtRJWVfiJR8jmw=',
		},
		{
			id: 'daejeon',
			name: 'Daejeon',
			latitude: 37.5666791,
			longitude: 126.9782914,
			imageUrl:
				'https://facts.net/wp-content/uploads/2023/07/50-facts-about-daejeon-taejon-1688365652.jpg',
		},
		{
			id: 'paris',
			name: 'Paris',
			latitude: 48.8534,
			longitude: 2.3488,
			imageUrl:
				'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: 'bali',
			name: 'Bali',
			latitude: -8.5377,
			longitude: 115.1888,
			imageUrl:
				'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: 'bangkok',
			name: 'Bangkok',
			latitude: -8.5377,
			longitude: 115.1888,
			imageUrl:
				'https://images.unsplash.com/photo-1598970605070-a38a6ccd3a2d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: 'shibuya',
			name: 'Shibuya',
			latitude: -8.5377,
			longitude: 115.1888,
			imageUrl:
				'https://images.unsplash.com/photo-1583930263826-a1c6a639eaf2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: 'shanghai',
			name: 'Shanghai',
			latitude: -8.5377,
			longitude: 115.1888,
			imageUrl:"https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		}
	],
};
export default function Page() {
	const router = useRouter();
	const session = useReadSessionQuery({});
	const avatarUrl = session.data?.user?.user_metadata?.avatar_url;
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 1 });
	const { data: upcomingTrips, isLoading: isLoadingUpcomingTrips } =
		useReadTripsQuery({ isUpcoming: true });
	const { data: pastTrips, isLoading: isLoadingPastTrips } = useReadTripsQuery({
		isUpcoming: false,
	});
	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm relative w-full h-full scrollbar-none overflow-y-scroll'>
				<div className='w-full relative aspect-auto h-1/4'>
					<Image
						src='https://images.unsplash.com/photo-1522426266214-ec2d2abb9ce0?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						alt='https://images.unsplash.com/photo-1522426266214-ec2d2abb9ce0?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						fill
						sizes='100%'
						// style={{ objectFit: 'contain',  }}
						className='w-full h-full'
					/>
					<div className='font-extrabold text-base-content text-2xl p-5 absolute bottom-0 left-0 right-0'>
						<div className='flex justify-center w-full z-10'>
							<div className='avatar z-10 animate-jump animate-twice animate-ease-in-out'>
								<div className='w-24 rounded-full shadow-lg'>
									<img
										src={avatarUrl ?? ''}
										alt='avatar'
									/>
								</div>
							</div>
						</div>
						<div className='absolute bottom-0 left-0 right-0 w-full h-16 bg-base-200 z-0 rounded-t-box'></div>
					</div>
				</div>
				<div
					className={`animate-once animate-ease-in-out duration-300 font-extrabold text-base-content text-2xl px-2 bg-base-200 cursor-default`}
				>
					Upcoming Trips
				</div>
				<div className='flex overflow-x-scroll h-fit flex-nowrap py-2 bg-base-200 text-base-content scrollbar-none'>
					<TripCard
						props={{
							id: 'new',
							destination: 'plan a new trip !',
							startDate: '',
							endDate: '',
							pictureUrl: 'new',
							isNewTrip: true,
						}}
						key={'new'}
					/>
					{upcomingTrips && (
						<>
							{upcomingTrips.map((trip) => {
								return (
									<TripCard
										key={trip.id}
										props={{
											id: trip.id,
											startDate: trip.startDate ?? '???',
											endDate: trip.endDate ?? '???',
											destination: trip.destination ?? '???',
											pictureUrl:
												trip.imageUrl ?? '/images/trip_destination.jpeg',
										}}
									/>
								);
							})}
						</>
					)}
				</div>
				<div className='animate-once animate-ease-in-out font-extrabold text-base-content text-2xl px-2 bg-base-200 cursor-default'>
					Past Trips
				</div>
				<div className='flex overflow-x-scroll flex-nowrap py-2 bg-base-200 text-base-content scrollbar-none'>
					{pastTrips && (
						<>
							{pastTrips.map((trip) => {
								return (
									<TripCard
										key={trip.id}
										props={{
											id: trip.id,
											startDate: trip.startDate ?? '???',
											endDate: trip.endDate ?? '???',
											destination: trip.destination ?? '???',
											pictureUrl:
												trip.imageUrl ?? '/images/cancelled_trips.jpg',
										}}
									/>
								);
							})}
						</>
					)}
				</div>
				<div className='animate-once animate-ease-in-out font-extrabold text-base-content text-2xl px-2 bg-base-200 cursor-default'>
					Explore
				</div>
				<div
					className='w-full bg-base-200 text-base-content gap-2 p-2'
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					}}
				>
					{InitialState.explore.map((explore) => {
						return (
							<ExploreCard
								key={explore.id}
								props={{
									id: explore.id,
									name: explore.name,
									imageUrl: explore.imageUrl,
								}}
							/>
						);
					})}
				</div>
			</div>
		</main>
	);
}
