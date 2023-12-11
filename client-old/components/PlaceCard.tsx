import { useReadPhotoUrlQuery } from '@/store/placeApi';
import { SwiperSlide } from 'swiper/react';
import { z } from 'zod';
import Image from 'next/image';
import { Loading } from './Loading';
import 'swiper/css';
import 'swiper/css/pagination';
export const PlaceCardPropsSchema = z.object({
	imageName: z.string(),
});

export type PlaceCardProps = z.infer<typeof PlaceCardPropsSchema>;

export const PlaceCard = ({ props }: { props: PlaceCardProps }) => {
	const { data: photoUrl, isLoading: isLoadingPhoto } = useReadPhotoUrlQuery({
		photo_name: props.imageName,
	});
	return (
		<>
			{isLoadingPhoto && <Loading />}
			{photoUrl && (
				<Image
					src={photoUrl.imageUrl}
					alt={photoUrl.imageUrl ?? 'image'}
					// placeholder='blur'
					// blurDataURL={`${v.name}?quality=20`}
					sizes='100%'
					fill
					style={{ objectFit: 'cover' }}
				/>
			)}
		</>
	);
};
