'use client';

import { Message } from '@/components/Message';
import {
	useReadMessagesQuery,
	useSendMessageMutation,
} from '@/store/messageApi';
import { useParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function Page() {
	const params = useParams();
	const tripId = params?.['trip-id'] as string;
	const isNewTrip = tripId === 'new';
	const [sendMessage, sendMessageRes] = useSendMessageMutation();
	const { data: messages, isLoading: isLoadingMessages } = useReadMessagesQuery(
		{ order: 'desc', limit: 20, tripId: tripId }
	);

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

	return (
		<main className='w-full h-full flex justify-center'>
			<div className='max-w-screen-sm text-base-content/70 flex flex-col justify-end relative w-full'>
				{isNewTrip && (
					<div className='top-0 absolute  w-full text-center p-2 animate-jump animate-twice animate-ease-in-out'>
						It’s a big world, tell me where do you want to explore?
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
				<div className='p-2'>
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
			</div>
		</main>
	);
}
