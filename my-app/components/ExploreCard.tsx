'use client';

import { useInView } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
export const ExploreCardPropsSchema = z.object({
	id: z.string(),
	name: z.string(),
	imageUrl: z.string(),
});

export type ExploreCardProps = z.infer<typeof ExploreCardPropsSchema>;

export const ExploreCard = ({ props }: { props: ExploreCardProps }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 1 });
	const router = useRouter();

	const exploreCardClickHandler = () => {
        toast.error("Coming soon!")
        // throw new Error("Coming soon!")
        router.push(`/explore/${props.id}`);
    };

	return (
		<div
			className='cursor-pointer rounded-box shadow-inner max-w-xl h-[200px] relative overflow-hidden'
			ref={ref}
			onClick={exploreCardClickHandler}
		>
			<Image
				src={props.imageUrl}
				alt={props.imageUrl}
				fill
				className={`hover:scale-150 duration-300 ${
					isInView ? 'grayscale-0 scale-150' : 'grayscale'
				} hover:grayscale-0 hover:shadow-inner`}
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
				<div className='text-2xl font-extrabold mix-blend-difference text-white/70 '>
					{props.name}
				</div>
			</div>
		</div>
	);
};
