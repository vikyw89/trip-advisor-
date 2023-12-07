'use client';
import { ExploreCard } from '@/components/ExploreCard';
import { TripCard } from '@/components/TripCard';
import { useReadSessionQuery } from '@/store/authApi';
import { useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Image from 'next/image';

const InitialState = {
	trips: [
		{
			id: 'ddd',
			startDate: '20221101',
			endDate: '20221102',
			destination: 'Daejeon',
			origin: 'Seoul',
			placeToVisit: [
				{
					id: 'aaa',
					name: 'Seoul',
					latitude: 37.5666791,
					longitude: 126.9782914,
				},
			],
			imageUrl:
				'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg',
		},
		{
			id: 'ddd',
			startDate: '20221101',
			endDate: '20221102',
			destination: 'Daejeon',
			origin: 'Seoul',
			placeToVisit: [
				{
					id: 'aaa',
					name: 'Seoul',
					latitude: 37.5666791,
					longitude: 126.9782914,
				},
			],
			imageUrl:
				'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg',
		},
		{
			id: 'ddd',
			startDate: '20221101',
			endDate: '20221102',
			destination: 'Daejeon',
			origin: 'Seoul',
			placeToVisit: [
				{
					id: 'aaa',
					name: 'Seoul',
					latitude: 37.5666791,
					longitude: 126.9782914,
				},
			],
			imageUrl:
				'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg',
		},
		{
			id: 'ddd',
			startDate: '20221101',
			endDate: '20221102',
			destination: 'Daejeon',
			origin: 'Seoul',
			placeToVisit: [
				{
					id: 'aaa',
					name: 'Seoul',
					latitude: 37.5666791,
					longitude: 126.9782914,
				},
			],
			imageUrl:
				'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg',
		},
		{
			id: 'ddd',
			startDate: '20221101',
			endDate: '20221102',
			destination: 'Daejeon',
			origin: 'Seoul',
			placeToVisit: [
				{
					id: 'aaa',
					name: 'Seoul',
					latitude: 37.5666791,
					longitude: 126.9782914,
				},
			],
			imageUrl:
				'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638883638/EducationHub/photos/colorful-signs.jpg',
		},
	],
	explore: [
		{
			id: 'ddd',
			name: 'Seoul',
			latitude: 37.5666791,
			longitude: 126.9782914,
			imageUrl:
				'https://media.istockphoto.com/id/464629385/photo/seoul-skyline.jpg?s=612x612&w=0&k=20&c=Wo9LYxk6L9z0VORPkMxjubMcAZfWAJtRJWVfiJR8jmw=',
		},
		{
			id: 'ddd',
			name: 'Daejeon',
			latitude: 37.5666791,
			longitude: 126.9782914,
			imageUrl:
				'data:image/jpeg;base64,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',
		},
		{
			id: '2',
			name: 'Tokyo',
			latitude: 0,
			longitude: 0,
			imageUrl:
				'https://www.rappler.com/tachyon/2022/12/tokyo-guide-december-20-2022.jpg',
		},
		{
			id: '2',
			name: 'Tokyo',
			latitude: 0,
			longitude: 0,
			imageUrl:
				'https://www.rappler.com/tachyon/2022/12/tokyo-guide-december-20-2022.jpg',
		},
		{
			id: '2',
			name: 'Tokyo',
			latitude: 0,
			longitude: 0,
			imageUrl:
				'https://www.rappler.com/tachyon/2022/12/tokyo-guide-december-20-2022.jpg',
		},
	],
};
export default function Page() {
	const router = useRouter();
	const session = useReadSessionQuery({});
	const avatarUrl = session.data?.user?.user_metadata?.avatar_url;
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 1 });

	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm relative w-full h-full scrollbar-none overflow-y-scroll'>
				<div className='w-full relative aspect-auto h-1/4'>
					<Image
						src='https://images.unsplash.com/photo-1522426266214-ec2d2abb9ce0?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						alt='https://images.unsplash.com/photo-1522426266214-ec2d2abb9ce0?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						fill
						// style={{ objectFit: 'contain',  }}
						className='w-full h-full'
					/>
					<div className='font-extrabold text-base-content text-2xl p-5 absolute bottom-0 left-0 right-0'>
						<div className='flex justify-center w-full z-10'>
							<div className='avatar z-10 animate-jump animate-twice animate-ease-in-out'>
								<div className='w-24 rounded-full shadow-lg'>
									<img src={avatarUrl ?? ''} alt="avatar"/>
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
					{InitialState.trips.map((trip) => {
						return (
							<TripCard
								key={trip.id}
								props={{
									id: trip.id,
									startDate: trip.startDate,
									endDate: trip.endDate,
									destination: trip.destination,
									pictureUrl: trip.imageUrl,
								}}
							/>
						);
					})}
				</div>
				<div className='animate-once animate-ease-in-out font-extrabold text-base-content text-2xl px-2 bg-base-200 cursor-default'>
					Past Trips
				</div>
				<div className='flex overflow-x-scroll flex-nowrap py-2 bg-base-200 text-base-content scrollbar-none'>
					{InitialState.trips.map((trip) => {
						return (
							<TripCard
								key={trip.id}
								props={{
									id: trip.id,
									startDate: trip.startDate,
									endDate: trip.endDate,
									destination: trip.destination,
									pictureUrl: trip.imageUrl,
								}}
							/>
						);
					})}
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
