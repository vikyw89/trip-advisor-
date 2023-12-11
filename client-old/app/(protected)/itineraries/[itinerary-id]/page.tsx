"use client"

import { Loading } from '@/components/Loading';
import { useReadItineraryQuery } from '@/store/itinerary';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';

export default function Page() {
	const params = useParams();
	const itineraryId = params?.['itinerary-id'] as string;
	const { data: itinerary, isLoading: isLoadingItinerary } =
		useReadItineraryQuery({ itineraryId: itineraryId });
	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm text-base-content/70 flex flex-col justify-start relative w-full'>
				{isLoadingItinerary && <Loading />}
				{itinerary && (
					<Markdown className='prose bg-base-100 text-base-content'>
						{itinerary.content}
					</Markdown>
				)}
			</div>
		</main>
	);
}
