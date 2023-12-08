'use client';

import { Message } from '@/components/Message';
import { useReadItinerariesQuery } from '@/store/itinerary';
import {
	useReadMessagesQuery,
	useSendMessageMutation,
} from '@/store/messageApi';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef } from 'react';
import remarkGfm from 'remark-gfm';
import { Swiper, SwiperSlide } from 'swiper/react';
import Markdown from 'react-markdown';

import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Page() {
	const params = useParams();
	const tripId = params?.['trip-id'] as string;
	const isNewTrip = tripId === 'new';
	const [sendMessage, sendMessageRes] = useSendMessageMutation();
	const { data: messages, isLoading: isLoadingMessages } = useReadMessagesQuery(
		{ order: 'asc', limit: 20, tripId: tripId }
	);
	const { data: itineraries, isLoading: isLoadingItineraries } =
		useReadItinerariesQuery({ tripId: tripId });
	const router = useRouter();
	const ref = useRef(null);

	const sendMessageHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const message = formData.get('message');
		if (!message) return;
		e.currentTarget.reset();

		// send message
		await sendMessage({
			text: message as string,
			file: undefined,
			tripId: tripId,
		});
	};

	const itineraryClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const itineraryId = e.currentTarget.dataset.id;
		// navigate to itinerary page
		router.push(`/itineraries/${itineraryId}`);
	};

	useEffect(() => {
		const container = ref.current;
		if (!container) return;
		// @ts-ignore
		container.scrollTo({
			// @ts-ignore
			top: container.scrollHeight,
			behavior: 'smooth',
		});
	}, [messages]);

	return (
		<main className='w-full h-full flex justify-center'>
			<Swiper
				className='max-w-screen-sm text-base-content/70 w-full relative'
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
				modules={[Pagination]}
				direction={'vertical'}
				pagination={{
					dynamicBullets: true,
				}}
			>
				<SwiperSlide className='h-full w-full'>
					<div className='w-full h-full flex flex-col'>
						<div
							className='h-full overflow-y-scroll scrollbar-thin'
							ref={ref}
						>
							{messages && messages.length === 0 && (
								<div className='top-0 absolute w-full text-center p-2 animate-jump animate-once animate-ease-in-out duration-300 '>
									It’s a{' '}
									<span className='font-bold text-4xl text-primary '>BIG</span>{' '}
									world, tell me where do you want to explore?
								</div>
							)}
							{messages &&
								messages.map((v) => {
									return (
										<Message
											key={v.id}
											props={{
												content: v.text,
												isLoading: v.isLoading,
												sender: v.isUser ? 'user' : 'bot',
											}}
										/>
									);
								})}
						</div>
						<form
							className='w-full flex shadow-md rounded-full border-2 bg-base-300'
							onSubmit={sendMessageHandler}
						>
							<input
								type='text'
								placeholder='Type your destination'
								className='input w-full border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-base-300 text-base-content'
								name='message'
							/>
							<button className='btn-md btn btn-circle p-2 pl-3 bg-base-300'>
								<svg
									className='w-full h-full'
									xmlns='http://www.w3.org/2000/svg'
									width='1em'
									height='1em'
									viewBox='0 0 24 24'
								>
									<path
										fill='currentColor'
										d='M3 20v-6l8-2l-8-2V4l19 8Z'
									></path>
								</svg>
							</button>
						</form>
					</div>
				</SwiperSlide>
				<SwiperSlide className='h-full w-full'>
					{itineraries?.itineraries[0] && (
						<div className='w-full h-full flex flex-col'>
							<div>Itinerary</div>
							<Markdown remarkPlugins={[[remarkGfm]]} className='prose'>{itineraries.itineraries[0].content}</Markdown>
						</div>
					)}
				</SwiperSlide>
			</Swiper>
		</main>
	);
}
