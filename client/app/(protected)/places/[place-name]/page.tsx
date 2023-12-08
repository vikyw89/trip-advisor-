'use client';

import { useReadLocationFromTextQuery } from '@/store/placeApi';
import { useParams } from 'next/navigation';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide} from 'swiper/react';
// import required modules
import { Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { PlaceCard } from '@/components/PlaceCard';

export default function Page() {
	const params = useParams();
	const placeName = params?.['place-name'] as string;
	const { data: location, isLoading: isLoadingLocation } =
		useReadLocationFromTextQuery({ locationName: placeName });

	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm text-base-content/70 relative w-full'>
				<Swiper
					onSlideChange={() => console.log('slide change')}
					onSwiper={(swiper) => console.log(swiper)}
					modules={[Pagination]}
					pagination={{
						dynamicBullets: true,
					}}
					className='h-full'
				>
					{location &&
						location.places[0].photos.map((v) => {
							return (
								<SwiperSlide key={v.name}>
									<PlaceCard key={v.name} props={{
										imageName:v.name,
									}}/>
								</SwiperSlide>
							);
						})}
				</Swiper>
			</div>
		</main>
	);
}
